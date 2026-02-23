package com.mikeo.plasso.features.files.DTO;

import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.entity.Project;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class fileResponseDTO {

    private String id;

    private Project project;

    private ProjectFile parent; // Null = root level file

    private List<ProjectFile> children = new ArrayList<>(); // Empty if it's a file

    private String name; // e.g., "main.js" or "utils" (folder name)

    private String language; // e.g., "javascript", "python" (null for folders)

    private boolean folder = false; // true = folder, false = file

    private boolean mainFile = false; // Entry point for execution

    private String content; // Store code as plain text

    //private String createdBy;
    //private String updatedBy;

    public fileResponseDTO() {
    }

    public fileResponseDTO(List<ProjectFile> children, String content, boolean folder, String id, String language, boolean mainFile, String name, ProjectFile parent, Project project) {
        this.children = children;
        this.content = content;
        this.folder = folder;
        this.id = id;
        this.language = language;
        this.mainFile = mainFile;
        this.name = name;
        this.parent = parent;
        this.project = project;
    }

    public fileResponseDTO(String name, ProjectFile parent, Project project) {
        this.name = name;
        this.parent = parent;
        this.project = project;
        this.folder = true;
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

    public boolean isFolder() {
        return folder;
    }

    public void setFolder(boolean folder) {
        this.folder = folder;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isMainFile() {
        return mainFile;
    }

    public void setMainFile(boolean mainFile) {
        this.mainFile = mainFile;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProjectFile getParent() {
        return parent;
    }

    public void setParent(ProjectFile parent) {
        this.parent = parent;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
