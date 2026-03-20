package com.mikeo.plasso.features.aiReview;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai-analysis")
public class AIController {

    public record ReviewItem(
            String type,      // "warning", "suggestion", "info"
            String title,
            String message,
            Integer line      // nullable
    ) {}

    @PostMapping("/")
    public ResponseEntity<ReviewItem> geminiReview(
            HttpServletRequest request,
            @RequestBody String fileId
    ){
        
    }
}
