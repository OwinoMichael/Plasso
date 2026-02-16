package com.mikeo.plasso.application.auth.events;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

// Email Service (Subscriber)
@Service
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${app.base-url}")
    private String baseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @EventListener
    public void handleUserRegistrationEvent(UserRegistrationEventObject event) {
        String action = event.isResend() ? "complete" : "verify";
        String subject = event.isResend()
                ? "New Verification Link"
                : "Complete Your Registration";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(event.getEmail());
        message.setSubject(subject);
        message.setText(String.format(
                "Please click to %s your registration: %s/verify?token=%s",
                action,
                baseUrl,
                event.getVerificationToken()
        ));
        mailSender.send(message);
    }

    @Async
    public void sendMagicLinkSignup(String email, String magicLink, int expiryMinutes) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Welcome to CodeSync - Complete Your Signup");
            message.setText(String.format(
                    "Welcome to CodeSync!\n\n" +
                            "Click the link below to complete your signup and get started:\n\n" +
                            "%s\n\n" +
                            "This link will expire in %d minutes.\n\n" +
                            "If you didn't request this, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "CodeSync Team",
                    magicLink,
                    expiryMinutes
            ));

            mailSender.send(message);
            //logger.info("Magic link signup email sent to: {}", email);
        } catch (Exception e) {
            //logger.error("Failed to send magic link signup email to: {}", email, e);
            throw new RuntimeException("Failed to send magic link email", e);
        }
    }

    @Async
    public void sendMagicLinkLogin(String email, String magicLink, int expiryMinutes) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("CodeSync - Your Login Link");
            message.setText(String.format(
                    "Hi there!\n\n" +
                            "Click the link below to sign in to your CodeSync account:\n\n" +
                            "%s\n\n" +
                            "This link will expire in %d minutes.\n\n" +
                            "If you didn't request this, please ignore this email and your account will remain secure.\n\n" +
                            "Best regards,\n" +
                            "CodeSync Team",
                    magicLink,
                    expiryMinutes
            ));

            mailSender.send(message);
            //logger.info("Magic link login email sent to: {}", email);
        } catch (Exception e) {
            //logger.error("Failed to send magic link login email to: {}", email, e);
            throw new RuntimeException("Failed to send magic link email", e);
        }
    }
}
