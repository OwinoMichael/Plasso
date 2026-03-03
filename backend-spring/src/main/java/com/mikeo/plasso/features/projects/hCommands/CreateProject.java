package com.mikeo.plasso.features.projects.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.BusinessValidationException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.hCommands.AutoGenerateFiles;
import com.mikeo.plasso.features.projects.ProjectController;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.projects.DTO.ProjectRequestDTO;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.View;

@Service
@Transactional
public class CreateProject implements Command<ProjectController.CreateProjectCommand, ProjectResponseDTO> {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FileRepository FileRepository;
    private final AutoGenerateFiles autoGenerateFiles;
    private final View error;

    public CreateProject(ProjectRepository projectRepository,
                         UserRepository userRepository,
                         FileRepository FileRepository,
                         AutoGenerateFiles autoGenerateFiles,
                         View error) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.FileRepository = FileRepository;
        this.autoGenerateFiles = autoGenerateFiles;
        this.error = error;
    }

    @Override
    public ResponseEntity<ProjectResponseDTO> execute(ProjectController.CreateProjectCommand projectCommand) {
        String userId = projectCommand.id();
        ProjectRequestDTO projectRequestDTO = projectCommand.projectRequestDTO();

        try{
            if(projectRepository.existsByName(projectRequestDTO.getName())){
                throw new BusinessValidationException("Project title already exists");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> {
                        return new ResourceNotFoundException("User not found");
                    });

            Project project = new Project();
            project.setName(projectRequestDTO.getName());
            project.setDescription(projectRequestDTO.getDescription());
            project.setLanguage(projectRequestDTO.getLanguage());
            project.setPublicProject(projectRequestDTO.isPublic());
            project.setOwner(user);
            project.getCollaborators().add(user);

            // Save project first to get ID
            project = projectRepository.save(project);

            if(projectRequestDTO.isAutoGenerate()){
                autoGenerateFiles.generateDefaultFiles(project, projectRequestDTO.getLanguage());
            }

            return ResponseEntity.ok(mapToResponseDTO(project, userId));
        } catch (Exception e) {
            throw e; // Re-throw to be handled by global exception handler
        }
    }

    public ProjectResponseDTO mapToResponseDTO(Project project, String currentUserId){
        ProjectResponseDTO projectResponseDTO = new ProjectResponseDTO();

        projectResponseDTO.setId(project.getId());
        projectResponseDTO.setName(project.getName());
        projectResponseDTO.setDescription(project.getDescription());
        projectResponseDTO.setLanguage(project.getLanguage());
        projectResponseDTO.setCreatedAt(project.getCreatedAt());
        projectResponseDTO.setUpdatedAt(project.getUpdatedAt());

        // Set user role based on current user
        boolean isOwner = project.getOwner().getId().equals(currentUserId);
        projectResponseDTO.setUserRole(isOwner ? "OWNER" : "COLLABORATOR");

        // Count collaborators EXCLUDING the owner
        long collaboratorCount = project.getCollaborators().stream()
                .filter(collab -> !collab.getId().equals(project.getOwner().getId()))
                .count();
        projectResponseDTO.setCollaborators((int) collaboratorCount);

        return projectResponseDTO;
    }
}
