package com.mikeo.plasso.features.projects.handleQueries;

import com.mikeo.plasso.Query;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllProjects implements Query<UserProjectQueryParams, Page<Project>> {

    private final ProjectRepository projectRepository;

    public GetAllProjects(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<Page<Project>> execute(UserProjectQueryParams input) {
        return null;
    }
}
