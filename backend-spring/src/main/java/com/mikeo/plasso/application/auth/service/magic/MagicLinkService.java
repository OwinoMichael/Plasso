package com.mikeo.plasso.application.auth.service.magic;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.auth.MagicLinkTokenRepository;
import com.mikeo.plasso.application.auth.events.EmailService;
import com.mikeo.plasso.application.auth.model.magic.MagicLinkRequest;
import com.mikeo.plasso.application.auth.model.magic.MagicLinkResponse;
import com.mikeo.plasso.application.auth.model.magic.MagicLinkToken;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class MagicLinkService implements Command<MagicLinkRequest, MagicLinkResponse> {

    @Value("${app.frontend.base-url}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final MagicLinkTokenRepository magicLinkTokenRepository;
    private final EmailService emailService;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(MagicLinkService.class);
    private static final int TOKEN_EXPIRY_MINUTES = 15;

    public MagicLinkService(UserRepository userRepository,
                            MagicLinkTokenRepository magicLinkTokenRepository,
                            EmailService emailService, JWTUtil jwtUtil,

                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.magicLinkTokenRepository = magicLinkTokenRepository;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseEntity<MagicLinkResponse> execute(MagicLinkRequest input) {
        String email = input.getEmail().toLowerCase().trim();

        // Check if user exists
        Optional<User> existingUser = userRepository.findUsersByEmail(email);

        // Generate secure token
        String token = generateSecureToken();
        Instant expiryTime = Instant.now().plus(TOKEN_EXPIRY_MINUTES, ChronoUnit.MINUTES);

        // Save token
        MagicLinkToken magicLinkToken = new MagicLinkToken();
        magicLinkToken.setEmail(email);
        magicLinkToken.setToken(token);
        magicLinkToken.setExpiryTime(expiryTime);
        magicLinkToken.setUsed(false);
        magicLinkToken.setIsNewUser(existingUser.isEmpty());

        magicLinkTokenRepository.save(magicLinkToken);

        // Send email with magic link
        String magicLink = buildMagicLink(token);

        if (existingUser.isEmpty()) {
            emailService.sendMagicLinkSignup(email, magicLink, TOKEN_EXPIRY_MINUTES);
            logger.info("Magic link sent for new user signup: {}", email);
        } else {
            emailService.sendMagicLinkLogin(email, magicLink, TOKEN_EXPIRY_MINUTES);
            logger.info("Magic link sent for existing user login: {}", email);
        }

        MagicLinkResponse response = new MagicLinkResponse();
        response.setMessage("Magic link sent to your email");
        response.setEmail(email);

        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<?> verifyToken(String token) {
        Optional<MagicLinkToken> magicLinkTokenOpt = magicLinkTokenRepository.findByToken(token);

        if (magicLinkTokenOpt.isEmpty()) {
            logger.warn("Invalid magic link token attempted");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid or expired magic link"));
        }

        MagicLinkToken magicLinkToken = magicLinkTokenOpt.get();

        if (magicLinkToken.isUsed()) {
            logger.warn("Magic link token already used: {}", magicLinkToken.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "This magic link has already been used"));
        }

        if (Instant.now().isAfter(magicLinkToken.getExpiryTime())) {
            logger.warn("Expired magic link token for: {}", magicLinkToken.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "This magic link has expired"));
        }

        String email = magicLinkToken.getEmail();
        User user;

        try {
            if (magicLinkToken.getIsNewUser()) {
                user = new User();
                user.setEmail(email);
                user.setEmailVerified(true);
                user.setUsername(null);
                user.setPassword(null);
                user.setLastLogin(Instant.now());

                user = userRepository.saveAndFlush(user);
                logger.info("New user created via magic link: {}", email);
            } else {
                user = userRepository.findUsersByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                user.setLastLogin(Instant.now());
                user.setEmailVerified(true);
                user = userRepository.save(user);

                logger.info("Existing user logged in via magic link: {}", email);
            }

            // Mark token as used BEFORE generating JWT
            magicLinkToken.setUsed(true);
            magicLinkTokenRepository.save(magicLinkToken);

            // Generate JWT - ALWAYS use email as subject when username is null
            String jwtSubject = (user.getUsername() != null && !user.getUsername().isEmpty())
                    ? user.getUsername()
                    : user.getEmail();

            String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getUsername());

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("user", Map.of(
                    "id", user.getId(),
                    "email", user.getEmail(),
                    "username", user.getUsername() != null ? user.getUsername() : "",
                    "emailVerified", user.getIsEmailVerified(),
                    "hasUsername", user.getUsername() != null && !user.getUsername().isEmpty()
            ));

            logger.info("Magic link verification successful for: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error during magic link verification", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during verification"));
        }
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String buildMagicLink(String token) {
        return frontendUrl + "/plasso/auth/verify-magic-link?token=" + token;
    }
}
