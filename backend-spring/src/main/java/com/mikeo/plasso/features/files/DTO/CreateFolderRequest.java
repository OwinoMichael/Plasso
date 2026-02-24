package com.mikeo.plasso.features.files.DTO;

public class CreateFolderRequest {
    private String name;        // "src"
    private String parentId;    // null = root

    public CreateFolderRequest() {
    }

    public CreateFolderRequest(String name, String parentId) {
        this.name = name;
        this.parentId = parentId;
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