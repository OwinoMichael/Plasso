package com.mikeo.plasso.application.auth.service.email_pass;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;

@Service
public class EmailVerificationService implements Command<String, String> {


    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    @Value("${app.frontend.base-url}")
    private String baseUrl;

    public EmailVerificationService(UserRepository userRepository, JWTUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;

    }

    @Override
    public ResponseEntity<String> execute(String token) {
        if (!jwtUtil.validateToken(token)) {
            // Redirect to frontend error page
            URI redirectUri = URI.create(baseUrl + "/verify-error"); // Or whatever path you use
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(redirectUri);
            return new ResponseEntity<>(headers, HttpStatus.FOUND); // 302 redirect
        }

        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findUsersByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(true);
        userRepository.save(user);

        // Redirect to success page with optional login link
        URI redirectUri = URI.create(baseUrl + "/login");
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirectUri);
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
