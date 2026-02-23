package com.mikeo.plasso.features.projects.handleQueries;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Sort;

public class ProjectPagination {

    @Min(0)
    private int page;

    @Min(0) @Max(100)
    private int size;

    private String sortBy = "updatedAt";

    private Sort.Direction sortDirection = Sort.Direction.DESC;

    public ProjectPagination() {
    }

    public ProjectPagination(int page, int size, String sortBy, Sort.Direction sortDirection) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }

    @Min(0)
    public int getPage() {
        return page;
    }

    public void setPage(@Min(0) int page) {
        this.page = page;
    }

    @Min(0)
    @Max(100)
    public int getSize() {
        return size;
    }

    public void setSize(@Min(0) @Max(100) int size) {
        this.size = size;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public Sort.Direction getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(Sort.Direction sortDirection) {
        this.sortDirection = sortDirection;
    }
}
