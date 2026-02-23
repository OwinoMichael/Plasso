package com.mikeo.plasso.features.files.hCommands;


import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.stereotype.Service;

@Service
public class AutoGenerateFiles {

    private final FileRepository fileRepository;

    public AutoGenerateFiles(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public void generateDefaultFiles(Project project, String language) {
        switch (language.toLowerCase()) {
            case "javascript":
                generateJavaScriptFiles(project);
                break;
            case "python":
                generatePythonFiles(project);
                break;
            case "java":
                generateJavaFiles(project);
                break;
            default:
                generateJavaScriptFiles(project); // Default fallback
        }
    }

    private void generateJavaScriptFiles(Project project) {
        // Create src folder
        ProjectFile srcFolder = new ProjectFile();
        srcFolder.setName("src");
        srcFolder.setFolder(true);
        srcFolder.setProject(project);
        srcFolder = fileRepository.save(srcFolder);

        // Create main.js inside src
        ProjectFile mainJs = new ProjectFile();
        mainJs.setName("main.js");
        mainJs.setFolder(false);
        mainJs.setLanguage("javascript");
        mainJs.setMainFile(true); // Mark as entry point
        mainJs.setContent(getDefaultMainJsContent());
        mainJs.setParent(srcFolder);
        mainJs.setProject(project);
        fileRepository.save(mainJs);

        // Create README.md at root
        ProjectFile readme = new ProjectFile();
        readme.setName("README.md");
        readme.setFolder(false);
        readme.setLanguage("markdown");
        readme.setContent(getDefaultReadmeContent(project.getName()));
        readme.setProject(project);
        fileRepository.save(readme);
    }

    private void generatePythonFiles(Project project) {
        // Create main.py
        ProjectFile mainPy = new ProjectFile();
        mainPy.setName("main.py");
        mainPy.setFolder(false);
        mainPy.setLanguage("python");
        mainPy.setMainFile(true);
        mainPy.setContent(getDefaultMainPyContent());
        mainPy.setProject(project);
        fileRepository.save(mainPy);

        // Create README.md
        ProjectFile readme = new ProjectFile();
        readme.setName("README.md");
        readme.setFolder(false);
        readme.setLanguage("markdown");
        readme.setContent(getDefaultReadmeContent(project.getName()));
        readme.setProject(project);
        fileRepository.save(readme);
    }

    private void generateJavaFiles(Project project) {
        // Create src folder
        ProjectFile srcFolder = new ProjectFile();
        srcFolder.setName("src");
        srcFolder.setFolder(true);
        srcFolder.setProject(project);
        srcFolder = fileRepository.save(srcFolder);

        // Create Main.java
        ProjectFile mainJava = new ProjectFile();
        mainJava.setName("Main.java");
        mainJava.setFolder(false);
        mainJava.setLanguage("java");
        mainJava.setMainFile(true);
        mainJava.setContent(getDefaultMainJavaContent());
        mainJava.setParent(srcFolder);
        mainJava.setProject(project);
        fileRepository.save(mainJava);

        // Create README.md
        ProjectFile readme = new ProjectFile();
        readme.setName("README.md");
        readme.setFolder(false);
        readme.setLanguage("markdown");
        readme.setContent(getDefaultReadmeContent(project.getName()));
        readme.setProject(project);
        fileRepository.save(readme);
    }

    private String getDefaultMainJsContent() {
        return """
                // Welcome to CodeSync!
                function main() {
                    console.log('Hello, CodeSync!');
                    console.log('Start coding here...');
                }
                
                main();
                """;
    }

    private String getDefaultMainPyContent() {
        return """
                # Welcome to CodeSync!
                def main():
                    print('Hello, CodeSync!')
                    print('Start coding here...')
                
                if __name__ == '__main__':
                    main()
                """;
    }

    private String getDefaultMainJavaContent() {
        return """
                // Welcome to CodeSync!
                public class Main {
                    public static void main(String[] args) {
                        System.out.println("Hello, CodeSync!");
                        System.out.println("Start coding here...");
                    }
                }
                """;
    }

    private String getDefaultReadmeContent(String projectName) {
        return String.format("""
                # %s
                
                Welcome to your new project!
                
                ## Getting Started
                
                Start editing your code in the main file and click "Run" to execute.
                
                ## Features
                
                - Real-time collaboration
                - AI-powered code review
                - Instant code execution
                
                Happy coding! 🚀
                """, projectName);
    }
}
