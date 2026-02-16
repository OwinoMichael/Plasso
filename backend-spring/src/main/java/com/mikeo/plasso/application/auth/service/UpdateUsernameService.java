package com.mikeo.plasso.application.auth.service;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.auth.model.magic.UpdateUsernameRequest;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UpdateUsernameService implements Command<UpdateUsernameRequest, Map<String, Object>> {

    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(UpdateUsernameService.class);

    public UpdateUsernameService(UserRepository userRepository, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public ResponseEntity<Map<String, Object>> execute(UpdateUsernameRequest input) {
        String username = input.getUsername().toLowerCase().trim();

        // Check if username is already taken
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            logger.warn("Username already exists: {}", username);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken. Please choose another one."));
        }

        logger.info("Username update successful for: {}", username);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Username updated successfully");
        response.put("username", username);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Map<String, Object>> updateUsername(String email, UpdateUsernameRequest request) {
        String username = request.getUsername().toLowerCase().trim();

        // Find user by email
        User user = userRepository.findUsersByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if username is already taken by another user
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
            logger.warn("Username already exists: {}", username);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already taken. Please choose another one."));
        }

        // Update username
        user.setUsername(username);
        userRepository.save(user);

        logger.info("Username updated successfully for user: {}", email);

        // Generate new JWT with username as subject
        String newToken = jwtUtil.generateToken(username);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Username updated successfully");
        response.put("username", username);
        response.put("token", newToken);

        return ResponseEntity.ok(response);
    }
}