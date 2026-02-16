package com.mikeo.plasso.application.auth.model.magic;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class MagicLinkRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;


    public MagicLinkRequest() {
    }

    public MagicLinkRequest(String email) {
        this.email = email;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") String email) {
        this.email = email;
    }
}
