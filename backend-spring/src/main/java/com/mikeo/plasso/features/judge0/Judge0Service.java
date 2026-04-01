package com.mikeo.plasso.features.judge0;



import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.collabWs.cachingWrites.FileContentBuffer;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class Judge0Service {



    private final FileRepository fileRepository;
    private final ProjectRepository projectRepository;
    private final WebClient webClient;
    private final FileContentBuffer fileContentBuffer;

    public Judge0Service(FileRepository fileRepository, ProjectRepository projectRepository, WebClient.Builder webClientBuilder, FileContentBuffer fileContentBuffer) {
        this.fileRepository = fileRepository;
        this.projectRepository = projectRepository;
        this.webClient = webClientBuilder.build();
        this.fileContentBuffer = fileContentBuffer;
    }

    @Value("${judge0.api.url}")
    private String judge0Url;

    @Value("${judge0.api.key}")
    private String judge0ApiKey;

    @Value("${judge0.api.host}")
    private String judge0ApiHost;




    private static final Map<String, Integer> LANGUAGE_IDS = Map.of(
            "python", 71,
            "java", 62,
            "javascript", 63,
            "typescript", 74,
            "c", 50,
            "cpp", 54
    );

    // ── Run single file ────────────────────────────────────────────
    public ExecutionResult runFile(String fileId, String userId) {
        ProjectFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        // Verify access
        verifyAccess(file.getProject(), userId);

        String source = fileContentBuffer.getContent(fileId)
                .orElse(file.getContent());
        int languageId = resolveLanguageId(file.getLanguage());

        return submit(source, languageId);
    }

    // ── Run project (bundle all files matching main file language) ──
    public ExecutionResult runProject(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        verifyAccess(project, userId);

        // Find main file
        List<ProjectFile> allFiles = fileRepository.findByProjectId(projectId);

        ProjectFile mainFile = allFiles.stream()
                .filter(ProjectFile::isMainFile)
                .filter(f -> !f.isFolder())
                .findFirst()
                .orElseGet(() -> allFiles.stream()  // fallback: first file matching project language
                        .filter(f -> !f.isFolder())
                        .filter(f -> project.getLanguage() != null &&
                                project.getLanguage().equalsIgnoreCase(f.getLanguage()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalStateException(
                                "No main file set. Right-click a file and set it as main.")));

        String language = mainFile.getLanguage();
        int languageId = resolveLanguageId(language);

        // Bundle all files with same language
        String bundledSource = bundleFiles(mainFile, allFiles, language);

        return submit(bundledSource, languageId);
    }

    // ── Bundle files by language strategy ─────────────────────────
    private String bundleFiles(ProjectFile mainFile, List<ProjectFile> allFiles, String language) {
        List<ProjectFile> sameLanguageFiles = allFiles.stream()
                .filter(f -> !f.isFolder())
                .filter(f -> language.equalsIgnoreCase(f.getLanguage()))
                .filter(f -> f.getContent() != null && !f.getContent().isBlank())
                .collect(Collectors.toList());

        return switch (language.toLowerCase()) {
            case "python" -> bundlePython(mainFile, sameLanguageFiles);
            case "javascript", "typescript" -> bundleJS(mainFile, sameLanguageFiles);
            case "java" -> bundleJava(mainFile, sameLanguageFiles);
            case "c", "cpp" -> bundleC(mainFile, sameLanguageFiles);
            default -> mainFile.getContent();
        };
    }

    // Python: concatenate all non-main files first, then main
    private String bundlePython(ProjectFile mainFile, List<ProjectFile> files) {
        StringBuilder sb = new StringBuilder();
        files.stream()
                .filter(f -> !f.getId().equals(mainFile.getId()))
                .forEach(f -> sb.append("# --- ").append(f.getName()).append(" ---\n")
                        .append(f.getContent()).append("\n\n"));
        sb.append("# --- ").append(mainFile.getName()).append(" ---\n");
        sb.append(mainFile.getContent());
        return sb.toString();
    }

    // JavaScript/TypeScript: same as Python, strip import/export statements
    private String bundleJS(ProjectFile mainFile, List<ProjectFile> files) {
        StringBuilder sb = new StringBuilder();
        files.stream()
                .filter(f -> !f.getId().equals(mainFile.getId()))
                .forEach(f -> {
                    String cleaned = f.getContent()
                            .replaceAll("(?m)^\\s*(import|export).*$", ""); // strip imports
                    sb.append("// --- ").append(f.getName()).append(" ---\n")
                            .append(cleaned).append("\n\n");
                });
        sb.append("// --- ").append(mainFile.getName()).append(" ---\n");
        String mainCleaned = mainFile.getContent()
                .replaceAll("(?m)^\\s*import.*$", ""); // strip imports in main too
        sb.append(mainCleaned);
        return sb.toString();
    }

    // Java: Judge0 supports single public class — concatenate as inner classes
    private String bundleJava(ProjectFile mainFile, List<ProjectFile> files) {
        StringBuilder sb = new StringBuilder();
        // Non-main files — strip package/import declarations
        files.stream()
                .filter(f -> !f.getId().equals(mainFile.getId()))
                .forEach(f -> {
                    String cleaned = f.getContent()
                            .replaceAll("(?m)^\\s*(package|import).*$", "")
                            .replaceAll("(?m)^\\s*public\\s+class", "class"); // remove public
                    sb.append(cleaned).append("\n\n");
                });
        // Main file last
        sb.append(mainFile.getContent());
        return sb.toString();
    }

    // C/C++: concatenate with header guards, non-main files first
    private String bundleC(ProjectFile mainFile, List<ProjectFile> files) {
        StringBuilder sb = new StringBuilder();
        files.stream()
                .filter(f -> !f.getId().equals(mainFile.getId()))
                .forEach(f -> sb.append("// --- ").append(f.getName()).append(" ---\n")
                        .append(f.getContent()).append("\n\n"));
        sb.append(mainFile.getContent());
        return sb.toString();
    }

    // ── Submit to Judge0 ───────────────────────────────────────────
    private ExecutionResult submit(String sourceCode, int languageId) {
        // Step 1: create submission
        Map<String, Object> submissionBody = Map.of(
                "source_code", sourceCode,
                "language_id", languageId,
                "wait", true   // synchronous — wait for result
        );

        Map response = webClient.post()
                .uri(judge0Url + "/submissions?base64_encoded=false&wait=true")
                .header("X-RapidAPI-Key", judge0ApiKey)
                .header("X-RapidAPI-Host", judge0ApiHost)
                .header("Content-Type", "application/json")
                .bodyValue(submissionBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            return new ExecutionResult(null, "No response from Judge0", "Error", 0, 0);
        }

        String stdout   = (String) response.get("stdout");
        String stderr   = (String) response.get("stderr");
        String compileOutput = (String) response.get("compile_output");
        Object statusObj = response.get("status");
        String status   = statusObj instanceof Map
                ? (String) ((Map<?, ?>) statusObj).get("description")
                : "Unknown";
        double time     = response.get("time") != null
                ? Double.parseDouble(response.get("time").toString()) : 0;
        int memory      = response.get("memory") != null
                ? (int) response.get("memory") : 0;

        // Prefer compile error over stderr
        String errorOutput = compileOutput != null ? compileOutput : stderr;

        return new ExecutionResult(stdout, errorOutput, status, time, memory);
    }

    // ── Helpers ────────────────────────────────────────────────────
    private int resolveLanguageId(String language) {
        if (language == null) throw new IllegalArgumentException("File has no language set");
        Integer id = LANGUAGE_IDS.get(language.toLowerCase());
        if (id == null) throw new IllegalArgumentException("Unsupported language: " + language);
        return id;
    }

    private void verifyAccess(Project project, String userId) {
        boolean hasAccess = project.getOwner().getId().equals(userId)
                || project.getCollaborators().stream()
                .anyMatch(u -> u.getId().equals(userId));
        if (!hasAccess) throw new SecurityException("Access denied");
    }
}
