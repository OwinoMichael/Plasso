package com.mikeo.plasso.features.files.DTO;

import java.util.ArrayList;
import java.util.List;

public class FileTreeResponse {
    private String id;
    private String name;
    private boolean folder;
    private String language;
    private boolean mainFile;
    private List<FileTreeResponse> children;

    // Constructors
    public FileTreeResponse() {
        this.children = new ArrayList<>();
    }

    public FileTreeResponse(String id, String name, boolean folder, String language, boolean mainFile) {
        this.id = id;
        this.name = name;
        this.folder = folder;
        this.language = language;
        this.mainFile = mainFile;
        this.children = new ArrayList<>();
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

    public List<FileTreeResponse> getChildren() {
        return children;
    }

    public void setChildren(List<FileTreeResponse> children) {
        this.children = children;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}