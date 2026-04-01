package com.mikeo.plasso.features.aiReview;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.collabWs.cachingWrites.FileContentBuffer;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.List;
import java.util.Map;

@Service
public class GeminiService implements Command<Pair<String, String>, List<ReviewItem>> {

    private final WebClient webClient;
    private final FileRepository fileRepository;
    private final ObjectMapper objectMapper;
    private final FileContentBuffer fileContentBuffer;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public GeminiService(FileRepository fileRepository, WebClient.Builder webClientBuilder, ObjectMapper objectMapper, FileContentBuffer fileContentBuffer) {
        this.fileRepository = fileRepository;
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
        this.fileContentBuffer = fileContentBuffer;
    }

    @Override
    public ResponseEntity<List<ReviewItem>> execute(Pair<String, String> input) {
        String userId = input.getFirst();
        String fileId = input.getSecond();

        System.out.println("AI Review - userId: " + userId + " fileId: " + fileId);

        ProjectFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        System.out.println("File found: " + file.getName());

        verifyHasAccess(userId, file.getProject());

        String content = fileContentBuffer.getContent(fileId)
                .orElse(file.getContent());
        String language = file.getLanguage() != null ? file.getLanguage() : "code";

        String prompt = buildPrompt(content, language);

        System.out.println("Access verified, calling Gemini...");

        String rawResponse = callGemini(prompt);

        return ResponseEntity.ok(parseReviews(rawResponse));
    }

    private String buildPrompt(String content, String language) {
        return """
                You are an expert code reviewer. Analyze this %s code carefully.
                Return ONLY a JSON array with no markdown, no explanation, no code fences.
                Each object must have exactly these fields:
                - "type": one of "warning", "suggestion", "info"
                - "title": short label e.g. "Unused Variable", "Good Practice"
                - "message": clear explanation of the issue or praise
                - "line": integer line number or null if not applicable
                
                Code to review:
                %s
                """.formatted(language, content);
    }

    private String callGemini(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        Map response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .doOnNext(body -> System.err.println("Gemini API error: " + body))
                                .map(body -> new RuntimeException("Gemini API error: " + body)))
                .bodyToMono(Map.class)
                .block();

        System.out.println("Gemini response: " + response);

        // Extract text from Gemini response structure
        try {
            List candidates = (List) response.get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            Map part = (Map) parts.get(0);
            return (String) part.get("text");
        } catch (Exception e) {
            System.err.println("Gemini call failed: " + e.getMessage()); // ← add this
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    private List<ReviewItem> parseReviews(String raw) {
        try {
            // Strip any accidental markdown fences Gemini might add
            String cleaned = raw.replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();
            return objectMapper.readValue(cleaned,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, ReviewItem.class));
        } catch (Exception e) {
            // Return single error item if parsing fails
            return List.of(new ReviewItem("warning", "Parse Error",
                    "AI response could not be parsed: " + e.getMessage(), null));
        }
    }



    public void verifyHasAccess(String userId, Project project){
        boolean hasAccess = project.getOwner().getId().equals(userId)
                || project.getCollaborators().stream().anyMatch(u -> u.getId().equals(userId));
        if (!hasAccess) throw new SecurityException("Access denied");
    }
}
