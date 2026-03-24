package com.mikeo.plasso.features.aiReview;

import com.mikeo.plasso.Command;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GeminiService implements Command<Pair<String, String>, AIController.ReviewItem> {
    @Override
    public ResponseEntity<AIController.ReviewItem> execute(Pair<String, String> input) {
        return null;
    }
}
