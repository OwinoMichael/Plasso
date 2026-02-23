package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.DTO.ProjectRequestDTO;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.projects.handleCommands.CreateProject;
import com.mikeo.plasso.features.projects.handleQueries.GetAllProjects;
import com.mikeo.plasso.features.projects.handleQueries.UserProjectQueryParams;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final CreateProject createProject;
    private final GetAllProjects getAllProjects;

    public ProjectController(CreateProject createProject, GetAllProjects getAllProjects) {
        this.createProject = createProject;
        this.getAllProjects = getAllProjects;
    }

    @GetMapping("/")
    public ResponseEntity<Page<ProjectResponseDTO>> getAllProjects(@RequestBody UserProjectQueryParams userProjectQueryParams){
        return getAllProjects.execute(userProjectQueryParams);
    }

    @PostMapping("/create-project")
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectRequestDTO project){
        return createProject.execute(project);
    }

}
