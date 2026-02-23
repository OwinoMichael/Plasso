package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.DTO.ProjectRequestDTO;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.projects.hCommands.CreateProject;
import com.mikeo.plasso.features.projects.hQueries.GetAllProjects;
import com.mikeo.plasso.features.projects.hQueries.ProjectPagination;
import com.mikeo.plasso.features.projects.hQueries.UserProjectQueryParams;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final CreateProject createProject;
    private final GetAllProjects getAllProjects;
    private final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    public ProjectController(CreateProject createProject, GetAllProjects getAllProjects) {
        this.createProject = createProject;
        this.getAllProjects = getAllProjects;
    }

    @GetMapping("/")
    public ResponseEntity<Page<ProjectResponseDTO>> getAllProjects(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            HttpServletRequest request){ //// ✅ Get userId from JWT instead
        logger.info("fetching projects");

        String userIdFromToken = (String) request.getAttribute("userId");

        if (userIdFromToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProjectQueryParams params = new UserProjectQueryParams(
                 // Use userId from JWT, not from query param
                new ProjectPagination(page, size, sortBy, Sort.Direction.valueOf(sortDirection)),
                userIdFromToken
                );
        return getAllProjects.execute(params);
    }

    @PostMapping("/create-project")
    public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectRequestDTO project, HttpServletRequest request){

        // Get userId from JWT
        String userId = (String) request.getAttribute("userId");


        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        project.setUserId(userId);

        return createProject.execute(project);
    }

}
