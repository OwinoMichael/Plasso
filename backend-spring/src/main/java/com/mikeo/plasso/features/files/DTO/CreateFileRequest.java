package com.mikeo.plasso.features.files.DTO;

public class CreateFileRequest {
    private String name;        // "utils.js"
    private String parentId;    // null = root, or folder ID
    private String language;    // "javascript"
    private String content;     // "" for empty file

    public CreateFileRequest() {
    }

    public CreateFileRequest(String content, String language, String name, String parentId) {
        this.content = content;
        this.language = language;
        this.name = name;
        this.parentId = parentId;
    }

    public CreateFileRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
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