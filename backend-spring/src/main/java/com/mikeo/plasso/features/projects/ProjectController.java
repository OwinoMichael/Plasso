package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.projects.entity.ProjectRequestDTO;
import com.mikeo.plasso.features.projects.entity.ProjectResponseDTO;
import com.mikeo.plasso.features.projects.handleCommands.CreateProject;
import com.mikeo.plasso.features.projects.handleQueries.GetAllProjects;
import com.mikeo.plasso.features.projects.handleQueries.GetProject;
import com.mikeo.plasso.features.projects.handleQueries.UserProjectQueryParams;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final CreateProject createProject;

    public ProjectController(CreateProject createProject) {
        this.createProject = createProject;
    }

//    @GetMapping("/")

    @PostMapping("/create-project")
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectRequestDTO project){
        return createProject.execute(project);
    }

}
