package com.mikeo.plasso.application.auth.model.magic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateUsernameRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(
            regexp = "^[a-z][a-z0-9_]{2,19}$",
            message = "Username must start with a letter and contain only lowercase letters, numbers, and underscores"
    )
    private String username;

    public UpdateUsernameRequest() {
    }

    public UpdateUsernameRequest(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
