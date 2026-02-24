package com.mikeo.plasso.features.files.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.AccessDeniedException;
import com.mikeo.plasso.application.exceptions.BusinessValidationException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.files.DTO.FileResponseDTO;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SetMainFile implements Command<FileController.SetMainFileCommand, FileResponseDTO> {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public SetMainFile(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<FileResponseDTO> execute(FileController.SetMainFileCommand input) {
        String userId = input.userId();
        String projectId = input.projectId();
        String fileId = input.fileId();

        // Verify access
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        boolean hasAccess = project.getOwner().getId().equals(userId) ||
                project.getCollaborators().stream()
                        .anyMatch(collab -> collab.getId().equals(userId));

        if (!hasAccess) {
            throw new AccessDeniedException("You don't have access to this project");
        }

        // Get the file
        ProjectFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        if (file.isFolder()) {
            throw new BusinessValidationException("Cannot set a folder as main file");
        }

        // Unmark current main file
        ProjectFile currentMain = fileRepository.findByProjectIdAndMainFileTrue(projectId);
        if (currentMain != null) {
            currentMain.setMainFile(false);
            fileRepository.save(currentMain);
        }

        // Mark new main file
        file.setMainFile(true);
        file = fileRepository.save(file);

        return ResponseEntity.ok(mapToDTO(file));
    }

    private FileResponseDTO mapToDTO(ProjectFile file) {
        FileResponseDTO dto = new FileResponseDTO();
        dto.setId(file.getId());
        dto.setName(file.getName());
        dto.setMainFile(file.isMainFile());
        return dto;
    }
}