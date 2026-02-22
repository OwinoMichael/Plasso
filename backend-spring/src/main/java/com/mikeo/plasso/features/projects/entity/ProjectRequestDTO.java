package com.mikeo.plasso.features.projects.entity;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProjectRequestDTO {

    @NotNull(message = "User ID is required")
    private String userId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 1000)
    @Column(name = "description", length = 1000)
    private String description;

    @Size(max = 50)
    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "is_public", nullable = false)
    private boolean publicProject = false;

    public ProjectRequestDTO() {
    }

    public ProjectRequestDTO(String userId, String name, String description, String language, boolean publicProject) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.language = language;
        this.publicProject = publicProject;
    }

    public @NotNull(message = "User ID is required") String getUserId() {
        return userId;
    }

    public void setUserId(@NotNull(message = "User ID is required") String userId) {
        this.userId = userId;
    }

    public @NotBlank @Size(max = 100) String getName() {
        return name;
    }

    public void setName(@NotBlank @Size(max = 100) String name) {
        this.name = name;
    }

    public @Size(max = 1000) String getDescription() {
        return description;
    }

    public void setDescription(@Size(max = 1000) String description) {
        this.description = description;
    }

    public @Size(max = 50) String getLanguage() {
        return language;
    }

    public void setLanguage(@Size(max = 50) String language) {
        this.language = language;
    }

    public boolean isPublicProject() {
        return publicProject;
    }

    public void setPublicProject(boolean publicProject) {
        this.publicProject = publicProject;
    }
}
