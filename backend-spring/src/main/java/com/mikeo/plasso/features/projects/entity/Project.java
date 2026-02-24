package com.mikeo.plasso.features.projects.entity;

import com.mikeo.plasso.features.users.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "projects",
        indexes = {
                @Index(name = "idx_projects_owner", columnList = "owner_id"),
                @Index(name = "idx_projects_public", columnList = "is_public"),
                @Index(name = "idx_projects_language", columnList = "language"),
                @Index(name = "idx_projects_updated", columnList = "updated_at")
        }
)
public class Project extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;

    /* ========================
       Metadata
       ======================== */

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

    /* ========================
       Ownership
       ======================== */

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "owner_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_projects_owner")
    )
    private User owner;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "project_collaborators",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> collaborators = new HashSet<>();

    public Project() {
    }

    public Project(Set<User> collaborators, String description, String id, String language, String name, User owner, boolean publicProject) {
        this.collaborators = collaborators;
        this.description = description;
        this.id = id;
        this.language = language;
        this.name = name;
        this.owner = owner;
        this.publicProject = publicProject;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isPublicProject() {
        return publicProject;
    }

    public void setPublicProject(boolean publicProject) {
        this.publicProject = publicProject;
    }

    public Set<User> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(Set<User> collaborators) {
        this.collaborators = collaborators;
    }
}
