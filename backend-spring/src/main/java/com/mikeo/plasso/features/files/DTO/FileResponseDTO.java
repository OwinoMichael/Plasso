package com.mikeo.plasso.features.files.DTO;

import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.entity.Project;

import java.util.ArrayList;
import java.util.List;

public class FileResponseDTO {

    private String id;
    private String name;
    private String language;
    private boolean folder;
    private boolean mainFile;
    private String content;
    private String parentId;

    public FileResponseDTO() {
    }

    public FileResponseDTO(String content, boolean folder, String id, String language, boolean mainFile, String name, String parentId) {
        this.content = content;
        this.folder = folder;
        this.id = id;
        this.language = language;
        this.mainFile = mainFile;
        this.name = name;
        this.parentId = parentId;
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

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
}
