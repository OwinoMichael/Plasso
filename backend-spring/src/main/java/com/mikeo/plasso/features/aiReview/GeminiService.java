package com.mikeo.plasso.features.aiReview;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.users.UserRepository;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GeminiService implements Command<Pair<String, String>, AIController.ReviewItem> {

    private final UserRepository userRepository;
    private final FileRepository fileRepository;

    public GeminiService(FileRepository fileRepository, UserRepository userRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<AIController.ReviewItem> execute(Pair<String, String> input) {
        return null;
    }
}
