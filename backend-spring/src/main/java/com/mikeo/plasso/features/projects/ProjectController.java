package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.DTO.ProjectRequestDTO;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.projects.handleCommands.CreateProject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
