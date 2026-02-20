package com.mikeo.plasso.application.auth.model.email_pass;

public class ResendVerificationRequest {
    private String email;

    public ResendVerificationRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
