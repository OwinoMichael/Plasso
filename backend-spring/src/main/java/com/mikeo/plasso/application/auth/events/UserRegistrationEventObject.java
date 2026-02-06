package com.mikeo.plasso.application.auth.events;

public class UserRegistrationEventObject {
    private final String email;
    private final String verificationToken;

    private final boolean isResend;

    // Constructor with isResend defaulting to false
    public UserRegistrationEventObject(String email, String token) {
        this(email, token, false);
    }

    public UserRegistrationEventObject(String email, String token, boolean isResend) {
        this.email = email;
        this.verificationToken = token;
        this.isResend = isResend;
    }

    public String getEmail() {
        return email;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public boolean isResend() {
        return isResend;
    }
}

