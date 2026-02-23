package com.mikeo.plasso.features.projects.handleCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.BusinessValidationException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.projects.DTO.ProjectRequestDTO;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.View;

@Service
public class CreateProject implements Command<ProjectRequestDTO, ProjectResponseDTO> {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final View error;

    public CreateProject(ProjectRepository projectRepository, UserRepository userRepository, View error) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.error = error;
    }

    @Override
    public ResponseEntity<ProjectResponseDTO> execute(ProjectRequestDTO projectRequestDTO) {
        try{
            if(projectRepository.existsByName(projectRequestDTO.getName())){
                throw new BusinessValidationException("Case title already exists");
            }

            User user = userRepository.findById(projectRequestDTO.getUserId())
                    .orElseThrow(() -> {
                        return new ResourceNotFoundException("User not found");
                    });

            Project project = new Project();
            project.setName(projectRequestDTO.getName());
            project.setDescription(projectRequestDTO.getDescription());
            project.setLanguage(projectRequestDTO.getLanguage());
            project.setPublicProject(projectRequestDTO.isPublicProject());
            project.setOwner(user);

            return ResponseEntity.ok(mapToResponseDTO(project));
        } catch (Exception e) {
            throw e; // Re-throw to be handled by global exception handler
        }
    }

    public ProjectResponseDTO mapToResponseDTO(Project project){
        ProjectResponseDTO projectResponseDTO = new ProjectResponseDTO();

        projectResponseDTO.setId(project.getId());
        projectResponseDTO.setName(project.getName());
        projectResponseDTO.setDescription(project.getDescription());
        projectResponseDTO.setLanguage(project.getLanguage());
        projectResponseDTO.setCreatedAt(project.getCreatedAt());
        projectResponseDTO.setUpdatedAt(project.getUpdatedAt());

        return projectResponseDTO;
    }
}
