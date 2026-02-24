package com.mikeo.plasso.features.projects.hQueries;

public class UserProjectQueryParams {

    private final ProjectPagination projectPagination;
    private final String userId;

    public UserProjectQueryParams(ProjectPagination projectPagination, String userId) {
        this.projectPagination = projectPagination;
        this.userId = userId;
    }



    public ProjectPagination getProjectPagination() {
        return projectPagination;
    }

    public String getUserId() {
        return userId;
    }
}
