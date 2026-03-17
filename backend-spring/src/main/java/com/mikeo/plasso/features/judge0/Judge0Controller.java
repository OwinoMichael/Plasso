package com.mikeo.plasso.features.judge0;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/judge-zero")
public class Judge0Controller {

    private final Judge0Service judge0Service;

    public Judge0Controller(Judge0Service judge0Service) {
        this.judge0Service = judge0Service;
    }

    public record RunFileRequest(String fileId, String projectId) {}
    public record RunProjectRequest(String projectId) {}



    // Run a single file
    @GetMapping("/run-file/{fileId}")
    public ResponseEntity<ExecutionResult> runFile(@PathVariable String fileId,
                                                   HttpServletRequest httpRequest) {
        String userId = (String) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(judge0Service.runFile(fileId, userId));
    }

    // Run entire project
    @GetMapping("/run-project/{projectId}")
    public ResponseEntity<ExecutionResult> runProject(@PathVariable String projectId,
                                                      HttpServletRequest httpRequest) {
        String userId = (String) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(judge0Service.runProject(projectId, userId));
    }

}
