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



}
