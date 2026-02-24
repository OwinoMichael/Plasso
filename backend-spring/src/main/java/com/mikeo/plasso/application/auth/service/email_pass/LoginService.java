package com.mikeo.plasso.application.auth.service.email_pass;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.auth.model.email_pass.LoginRequest;
import com.mikeo.plasso.application.security.JWTUtil;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LoginService implements Command<LoginRequest, T> {

    private final AuthenticationManager authenticationManager;
    private final UserRepository usersRepository;
    private final PasswordEncoder encoder;
    private final JWTUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public LoginService(AuthenticationManager authenticationManager, UserRepository usersRepository, PasswordEncoder encoder, JWTUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.usersRepository = usersRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ResponseEntity execute(LoginRequest request)  {

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "INVALID_INPUT", "message", "Email is required"));
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "INVALID_INPUT", "message", "Password is required"));
        }

        try {
            // First, check if user exists and get their details
            User user = usersRepository.findUsersByEmail(request.getEmail().trim())
                    .orElse(null);

            if (user == null) {
                // User doesn't exist - return invalid credentials
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "INVALID_CREDENTIALS", "message", "Invalid email or password"));
            }


            // Check if user is verified BEFORE authentication
            if (!user.getIsEmailVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "error", "ACCOUNT_NOT_VERIFIED",
                                "message", "Please verify your email before logging in",
                                "email", user.getEmail()
                        ));
            }

            // Now authenticate the verified user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword())
            );

            // Generate token for verified and authenticated user
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "verified", user.getIsEmailVerified()
                    )
            ));

        } catch (BadCredentialsException e) {
            // This will now only catch actual password mismatches
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "INVALID_CREDENTIALS", "message", "Invalid email or password"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "SERVER_ERROR", "message", "An error occurred during login"));
        }
    }
}
