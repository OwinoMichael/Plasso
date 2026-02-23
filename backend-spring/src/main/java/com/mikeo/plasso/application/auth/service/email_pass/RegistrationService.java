package com.mikeo.plasso.application.auth.service.email_pass;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.auth.ValidationGroups;
import com.mikeo.plasso.application.auth.events.UserRegistrationEventObject;
import com.mikeo.plasso.application.auth.model.email_pass.UserRegistrationRequest;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.Optional;

@Service
@Transactional
public class RegistrationService implements Command<UserRegistrationRequest, T> {

    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;
    private final JWTUtil jwtUtil;
    private final ApplicationEventPublisher eventPublisher;
    private static final Logger logger = LoggerFactory.getLogger(RegistrationService.class);


    public RegistrationService(UserRepository usersRepository, PasswordEncoder encoder, JWTUtil jwtUtil, ApplicationEventPublisher eventPublisher) {
        this.usersRepository = usersRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.eventPublisher = eventPublisher;
    }


    @Override
    public ResponseEntity execute(@Validated(ValidationGroups.TraditionalSignup.class)UserRegistrationRequest request) {
        try {

            logger.info("Registration request received - Username: {}, Email: {}",
                    request.getUsername(), request.getEmail());

            Optional<User> existingUser = usersRepository.findUsersByEmail(request.getEmail());

            if(existingUser.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User with this email already exists");
            }

            User user = new User();
            // Don't set ID - @PrePersist will handle it
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(encoder.encode(request.getPassword()));
            user.setEmailVerified(false);

            // Log before save
            logger.info("About to save user - Username: {}, Email: {}, EmailVerified: {}",
                    user.getUsername(), user.getEmail(), user.getIsEmailVerified());

            User savedUser = usersRepository.save(user);

            // Generate verification token
            String verificationToken = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());
            eventPublisher.publishEvent(new UserRegistrationEventObject(savedUser.getEmail(), verificationToken));

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Registration successful. Please check your email for verification.");

        } catch (Exception e) {
            logger.error("Service execution failed", e);
            throw e;
        }
    }
}