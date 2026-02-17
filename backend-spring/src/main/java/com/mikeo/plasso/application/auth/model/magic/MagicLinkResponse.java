package com.mikeo.plasso.application.auth.model.magic;

// MagicLinkResponse.java
public class MagicLinkResponse {
    private String message;
    private String email;

    public MagicLinkResponse() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
