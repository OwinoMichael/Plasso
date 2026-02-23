package com.mikeo.plasso.features.projects.hQueries;

import com.mikeo.plasso.Query;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GetProject implements Query<Integer, Project> {

    private final ProjectRepository projectRepository;

    public GetProject(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<Project> execute(Integer input) {
        return null;
    }
}
