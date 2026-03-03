package com.mikeo.plasso.features.projects.DTO;

import java.time.Instant;

public class ProjectResponseDTO {

    private String id;
    private String name;
    private String description;
    private String language;
    private Instant createdAt;
    private Instant updatedAt;
    private String userRole;
    private Integer collaborators;

    public ProjectResponseDTO() {
    }

    public ProjectResponseDTO(Integer collaborators, Instant createdAt, String description, String id, String language, String name, Instant updatedAt, String userRole) {
        this.collaborators = collaborators;
        this.createdAt = createdAt;
        this.description = description;
        this.id = id;
        this.language = language;
        this.name = name;
        this.updatedAt = updatedAt;
        this.userRole = userRole;
    }

    public Integer getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(Integer collaborators) {
        this.collaborators = collaborators;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
