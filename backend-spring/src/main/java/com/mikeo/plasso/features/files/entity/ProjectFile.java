package com.mikeo.plasso.features.files.entity;

import com.mikeo.plasso.features.projects.entity.Project;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
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
    private ProjectFile parent; // Null = root level file

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectFile> children = new ArrayList<>(); // Empty if it's a file

    /* ========================
       File Metadata
       ======================== */

    @NotBlank
    @Size(max = 255)
    @Column(name = "name", nullable = false, length = 255)
    private String name; // e.g., "main.js" or "utils" (folder name)

    @Size(max = 50)
    @Column(name = "language", length = 50)
    private String language; // e.g., "javascript", "python" (null for folders)

    @Column(name = "is_folder", nullable = false)
    private boolean folder = false; // true = folder, false = file

    @Column(name = "is_main_file", nullable = false)
    private boolean mainFile = false; // Entry point for execution

    /* ========================
       Content (only for files, null for folders)
       ======================== */

    @Column(name = "content", columnDefinition = "TEXT")
    private String content; // Store code as plain text

    // Constructors
    public ProjectFile() {}

    public ProjectFile(String name, String content, String language, ProjectFile parent, Project project) {
        this.name = name;
        this.content = content;
        this.language = language;
        this.parent = parent;
        this.project = project;
        this.folder = false;
    }

    public ProjectFile(String name, ProjectFile parent, Project project) {
        this.name = name;
        this.parent = parent;
        this.project = project;
        this.folder = true;
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

    public List<ProjectFile> getChildren() {
        return children;
    }

    public void setChildren(List<ProjectFile> children) {
        this.children = children;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isMainFile() {
        return mainFile;
    }

    public void setMainFile(boolean mainFile) {
        this.mainFile = mainFile;
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


}
