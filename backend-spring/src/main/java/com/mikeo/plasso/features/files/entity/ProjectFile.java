package com.mikeo.plasso.features.files.entity;

import com.mikeo.plasso.features.projects.entity.Project;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(
        name = "files",
        indexes = {
                @Index(name = "idx_files_project", columnList = "project_id"),
                @Index(name = "idx_files_parent", columnList = "parent_id")
        }
)
public class ProjectFile extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;

    /* ========================
       Relationships
       ======================== */

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ProjectFile parent;

    /* ========================
       Metadata
       ======================== */

    @NotBlank
    @Size(max = 255)
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank
    @Size(max = 500)
    @Column(name = "path", nullable = false, length = 500)
    private String path;

    @Size(max = 50)
    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "is_folder", nullable = false)
    private boolean folder = false;

    /* ========================
       Content
       ======================== */

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content", columnDefinition = "jsonb")
    private Map<String, Object> content;

    public ProjectFile() {
    }

    public ProjectFile(String id, Project project, ProjectFile parent, String name, String path, String language, boolean folder, Map<String, Object> content) {
        this.id = id;
        this.project = project;
        this.parent = parent;
        this.name = name;
        this.path = path;
        this.language = language;
        this.folder = folder;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectFile getParent() {
        return parent;
    }

    public void setParent(ProjectFile parent) {
        this.parent = parent;
    }

    public @NotBlank @Size(max = 255) String getName() {
        return name;
    }

    public void setName(@NotBlank @Size(max = 255) String name) {
        this.name = name;
    }

    public @NotBlank @Size(max = 500) String getPath() {
        return path;
    }

    public void setPath(@NotBlank @Size(max = 500) String path) {
        this.path = path;
    }

    public @Size(max = 50) String getLanguage() {
        return language;
    }

    public void setLanguage(@Size(max = 50) String language) {
        this.language = language;
    }

    public boolean isFolder() {
        return folder;
    }

    public void setFolder(boolean folder) {
        this.folder = folder;
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void setContent(Map<String, Object> content) {
        this.content = content;
    }
}
