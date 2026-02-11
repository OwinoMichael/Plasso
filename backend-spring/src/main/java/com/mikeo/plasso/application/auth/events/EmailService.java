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
}
