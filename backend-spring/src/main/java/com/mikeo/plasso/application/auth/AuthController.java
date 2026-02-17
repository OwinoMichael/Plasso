package com.mikeo.plasso.application.auth;


import com.mikeo.plasso.application.auth.model.magic.MagicLinkRequest;
import com.mikeo.plasso.application.auth.model.magic.UpdateUsernameRequest;
import com.mikeo.plasso.application.auth.model.userpass.LoginRequest;
import com.mikeo.plasso.application.auth.model.userpass.ResendVerificationContext;
import com.mikeo.plasso.application.auth.model.userpass.ResendVerificationRequest;
import com.mikeo.plasso.application.auth.model.userpass.UserRegistrationRequest;
import com.mikeo.plasso.application.auth.service.*;

import com.mikeo.plasso.application.auth.service.magic.MagicLinkService;
import com.mikeo.plasso.application.auth.service.magic.UpdateUsernameService;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.tika.exception.TikaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/")
public class AuthController {

    private final RegistrationService registrationService;
    private final EmailVerificationService emailVerificationService;
    private final ResendEmailVerificationService resendEmailVerificationService;
    private final LoginService loginService;
    private final MagicLinkService magicLinkService;
    private final UpdateUsernameService updateUsernameService;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(RegistrationService registrationService, EmailVerificationService emailVerificationService, ResendEmailVerificationService resendEmailVerificationService, LoginService loginService, MagicLinkService magicLinkService, UpdateUsernameService updateUsernameService, UserRepository userRepository, JWTUtil jwtUtil)
    {
        this.registrationService = registrationService;
        this.emailVerificationService = emailVerificationService;
        this.resendEmailVerificationService = resendEmailVerificationService;
        this.loginService = loginService;
        this.magicLinkService = magicLinkService;
        this.updateUsernameService = updateUsernameService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/createNewUser")
    public ResponseEntity<?> createNewUser(@Validated(ValidationGroups.TraditionalSignup.class) @Valid @RequestBody UserRegistrationRequest request) {
        try {
            return registrationService.execute(request);
        } catch (Exception e) {
            // Log the actual error
            logger.error("Registration failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    @GetMapping("/verify")
    public ResponseEntity verifyUser(@RequestParam String token) throws TikaException, IOException, SAXException {
        return emailVerificationService.execute(token);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest) throws TikaException, IOException, SAXException {
        try {
            return loginService.execute(loginRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "SERVER_ERROR", "message", "Login failed"));
        }
    }


    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody ResendVerificationRequest request,
                                                     HttpServletRequest httpRequest) throws TikaException, IOException, SAXException {
        ResendVerificationContext context = new ResendVerificationContext(request, httpRequest);

        return resendEmailVerificationService.execute(context);
    }

    @PostMapping("/magic-link")
    public ResponseEntity<?> sendMagicLink(@Valid @RequestBody MagicLinkRequest request) {
        logger.info("Magic link requested for email: {}", request.getEmail());
        return magicLinkService.execute(request);
    }

    @GetMapping("/verify-magic-link")
    public ResponseEntity<?> verifyMagicLink(@RequestParam("token") String token) {
        logger.info("Verifying magic link token");
        try {
            return magicLinkService.verifyToken(token);
        } catch (Exception e) {
            logger.error("Error in verify magic link endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Verification failed: " + e.getMessage()));
        }
    }

    @PutMapping("/update-username")
    public ResponseEntity<?> updateUsername(
            @Valid @RequestBody UpdateUsernameRequest request,
            @RequestHeader("Authorization") String authHeader) {

        logger.info("Username update request received");

        try {
            // Extract token from Authorization header
            String token = authHeader.replace("Bearer ", "");

            // Extract email from token (since username might be null/email at this point)
            String subject = jwtUtil.extractUsername(token);

            // Find user by subject (could be email or username)
            Optional<User> userOpt = userRepository.findByUsername(subject);
            if (userOpt.isEmpty()) {
                userOpt = userRepository.findUsersByEmail(subject);
            }

            if (userOpt.isEmpty()) {
                logger.warn("User not found for subject: {}", subject);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            User user = userOpt.get();

            // Update username using service
            return updateUsernameService.updateUsername(user.getEmail(), request);

        } catch (Exception e) {
            logger.error("Error updating username", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred while updating username"));
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false));
        }

        // Get the subject (email or username) from JWT
        String subject = authentication.getName();

        // Try to find user by email first, then username
        Optional<User> userOpt = userRepository.findUsersByEmail(subject);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(subject);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false));
        }

        User user = userOpt.get();

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "username", user.getUsername() != null ? user.getUsername() : "",
                        "emailVerified", user.getIsEmailVerified(),
                        "hasUsername", user.getUsername() != null && !user.getUsername().isEmpty()
                )
        ));
    }

}
