package com.mikeo.plasso.features.aiReview;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ai-analysis")
public class AIController {

    private final GeminiService geminiService;

    public AIController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }



    @PostMapping("/")
    public ResponseEntity<List<ReviewItem>> geminiReview(
            HttpServletRequest request,
            @RequestBody String fileId
    ){

        String userId = (String) request.getAttribute("userId");

        Pair<String, String> pair = Pair.of(userId, fileId);

        return geminiService.execute(pair);

    }
}
