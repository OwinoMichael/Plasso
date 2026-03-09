package com.mikeo.plasso.features.projects.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.IllegalStateException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.projects.ProjectController;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AddColaborators implements Command<ProjectController.CollabCommand, Void> {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public AddColaborators(UserRepository userRepository, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<Void> execute(ProjectController.CollabCommand input) {
        String userId = input.userId();
        String projectId = input.projectId();
        String emailOrUsername = input.emailOrUsername();

        // Verify the current user exists and has permission
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Find the project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Find the user to add as collaborator
        User collabUser = userRepository.findByUsername(emailOrUsername)
                .orElseGet(() -> userRepository.findUsersByEmail(emailOrUsername)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "User not found with identifier: " + emailOrUsername)));

        // Check if already a collaborator
        if (project.getCollaborators().contains(collabUser)) {
            throw new IllegalStateException("User is already a collaborator");
        }

        // Add to project
        project.getCollaborators().add(collabUser);


         projectRepository.save(project);

        return ResponseEntity.ok().build();
    }
}
