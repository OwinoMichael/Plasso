package com.mikeo.plasso.features.projects.entity;

import com.mikeo.plasso.features.users.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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

    public Project() {
    }

    public Project(String id, String name, String description, String language, boolean publicProject, User owner) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.language = language;
        this.publicProject = publicProject;
        this.owner = owner;
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
}
