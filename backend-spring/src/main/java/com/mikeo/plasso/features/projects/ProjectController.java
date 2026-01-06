package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.projects.handleCommands.CreateProject;
import com.mikeo.plasso.features.projects.handleQueries.GetAllProjects;
import com.mikeo.plasso.features.projects.handleQueries.GetProject;
import com.mikeo.plasso.features.projects.handleQueries.UserProjectQueryParams;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final GetAllProjects getAllProjects;
    private final GetProject getProject;
    private final CreateProject createProject;

    public ProjectController(GetAllProjects getAllProjects, GetProject getProject, CreateProject createProject) {
        this.getAllProjects = getAllProjects;
        this.getProject = getProject;
        this.createProject = createProject;
    }

    @GetMapping("/")
    public ResponseEntity<List<Project>> getAllProjects(
            @Valid UserProjectQueryParams userProjectQueryParams,
            Authentication authentication){

        String email = (String) authentication.getPrincipal();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjects(String id){

    }

    @PostMapping("/create-project")
    public ResponseEntity<String> createProject(Project project){

    }

}
