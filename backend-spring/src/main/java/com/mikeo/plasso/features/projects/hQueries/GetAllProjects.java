package com.mikeo.plasso.features.projects.hQueries;

import com.mikeo.plasso.Query;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.hibernate.Hibernate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class GetAllProjects implements Query<UserProjectQueryParams, Page<ProjectResponseDTO>> {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public GetAllProjects(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<Page<ProjectResponseDTO>> execute(UserProjectQueryParams input) {
        ProjectPagination params = input.getProjectPagination();
        String userId = input.getUserId();

        if(userId == null || userId.trim().isEmpty()){
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        User realId = userRepository.findById(userId)
                .orElseThrow(() -> {
                    return new ResourceNotFoundException("User ID invalid");
                });

        System.out.println("=== DEBUG ===");
        System.out.println("Current User ID: " + realId);
        System.out.println("Current Username: " + realId.getUsername());

        Pageable pageable = PageRequest.of(
                params.getPage(),
                params.getSize(),
                Sort.by(params.getSortDirection(),params.getSortBy())
        );

        // Use the new query that includes collaborated projects
        Page<Project> page = projectRepository.findProjectsByUserAccess(userId, pageable);

        // Initialize collaborators while still in transaction
        page.forEach(project -> {
            Hibernate.initialize(project.getCollaborators());
        });

        Page<ProjectResponseDTO> pageDto = page.map(project -> this.mapToDTO(project, userId));
        //Page<ProjectResponseDTO> pageDto = page.map(this::mapToDTO);

        return ResponseEntity.ok(pageDto);
    }

    public ProjectResponseDTO mapToDTO(Project project, String currentUserId){
        if(project == null) return null;

        ProjectResponseDTO projectResponseDTO = new ProjectResponseDTO();
        projectResponseDTO.setId(project.getId());
        projectResponseDTO.setName(project.getName());
        projectResponseDTO.setDescription(project.getDescription());
        projectResponseDTO.setLanguage(project.getLanguage());
        projectResponseDTO.setCreatedAt(project.getCreatedAt());
        projectResponseDTO.setUpdatedAt(project.getUpdatedAt());

        // Debug inside mapping
        System.out.println("=== MAPPING PROJECT ===");
        System.out.println("Project: " + project.getName());
        System.out.println("Current User ID: " + currentUserId);
        System.out.println("Owner ID: " + project.getOwner().getId());

        // Set user role based on whether current user is owner or just collaborator
        boolean isOwner = project.getOwner().getId().equals(currentUserId);
        System.out.println("Is Owner? " + isOwner);
        projectResponseDTO.setUserRole(isOwner ? "OWNER" : "COLLABORATOR");

        // ADD THIS DEBUG - check if userRole was actually set
        System.out.println("userRole set to: " + projectResponseDTO.getUserRole());

        // Make sure collaborators are initialized
        Set<User> collaborators = project.getCollaborators();
        System.out.println("Collaborators set size: " + collaborators.size());

        // Count collaborators EXCLUDING the owner
        // Assuming collaborators set includes everyone (owner + other users)
        // Count collaborators excluding owner
        long collaboratorCount = collaborators.stream()
                .filter(collab -> {
                    boolean isNotOwner = !collab.getId().equals(project.getOwner().getId());
                    System.out.println("  Collaborator: " + collab.getUsername() +
                            " - Is Owner? " + collab.getId().equals(project.getOwner().getId()) +
                            " - Keep in count? " + isNotOwner);
                    return isNotOwner;
                })
                .count();

        System.out.println("Final collaborator count: " + collaboratorCount);
        projectResponseDTO.setCollaborators((int) collaboratorCount);

        return projectResponseDTO;
    }
}
