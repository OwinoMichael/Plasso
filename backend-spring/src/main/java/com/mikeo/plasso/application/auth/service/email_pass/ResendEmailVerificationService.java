package com.mikeo.plasso.application.auth.service.email_pass;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.auth.events.UserRegistrationEventObject;
import com.mikeo.plasso.application.auth.model.email_pass.ResendVerificationContext;
import com.mikeo.plasso.application.auth.model.email_pass.ResendVerificationRequest;
import com.mikeo.plasso.application.auth.service.RateLimitService;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ResendEmailVerificationService implements Command<ResendVerificationContext, String> {
    private final UserRepository userRepository;
    private final RateLimitService rateLimitService;
    private final JWTUtil jwtUtil;
    private final ApplicationEventPublisher eventPublisher;


    public ResendEmailVerificationService(UserRepository userRepository, RateLimitService rateLimitService, JWTUtil jwtUtil, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.rateLimitService = rateLimitService;
        this.jwtUtil = jwtUtil;
        this.eventPublisher = eventPublisher;

    }


    @Override
    public ResponseEntity<String> execute(ResendVerificationContext context)  {
        // Extract values from context
        ResendVerificationRequest request = context.getRequest();
        HttpServletRequest httpRequest = context.getHttpRequest();

        // 1. Rate limiting check
        String ip = httpRequest.getRemoteAddr();
        if (!rateLimitService.isAllowed("email_resend", ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Too many requests. Try again later.");
        }

        // 2. Find and validate user
        User user = userRepository.findUsersByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + request.getEmail()));

        if (user.getIsEmailVerified()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already verified");
        }

        // 3. Generate and send new token
        String verificationToken = jwtUtil.generateToken(user.getEmail(), user.getId());
        eventPublisher.publishEvent(new UserRegistrationEventObject(
                user.getEmail(),
                verificationToken,
                true // isResend flag
        ));

        return ResponseEntity.ok("Verification email resent");
    }
}

