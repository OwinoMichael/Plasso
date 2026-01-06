package com.mikeo.plasso.features.projects.handleCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CreateProject implements Command<Project, String> {

    private final ProjectRepository projectRepository;

    public CreateProject(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<String> execute(Project input) {
        return null;
    }
}
