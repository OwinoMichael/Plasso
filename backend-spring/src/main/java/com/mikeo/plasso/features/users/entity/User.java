package com.mikeo.plasso.features.users.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.Instant;


@Entity
@Table(name = "users")
public class User extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(
            regexp = "^[a-z][a-z0-9_]{2,19}$",
            message = "Username must start with a letter and contain only lowercase letters, numbers, and underscores"
    )
    @Column(name = "username", nullable = false, unique = true, length = 20)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(name = "email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must contain at least one digit, one lowercase, one uppercase, one special character, and no whitespace")
    @Column(name = "password")
    private String password;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false; // Default to false until verified

    @Column(name = "last_login")
    private Instant lastLogin;


    public User() {
    }


    public User(String id, String username, String email, String password, boolean emailVerified, Instant lastLogin) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.emailVerified = emailVerified;
        this.lastLogin = lastLogin;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "Username is required") @Size(min = 3, max = 20, message = "Username must be between 3-20 characters") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "Username is required") @Size(min = 3, max = 20, message = "Username must be between 3-20 characters") String username) {
        this.username = username;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") @Email(message = "Please provide a valid email address") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must contain at least one digit, one lowercase, one uppercase, one special character, and no whitespace") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must contain at least one digit, one lowercase, one uppercase, one special character, and no whitespace") String password) {
        this.password = password;
    }

    public boolean getIsEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Instant getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Instant lastLogin) {
        this.lastLogin = lastLogin;
    }
}
