package com.mikeo.plasso.features.files.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.AccessDeniedException;
import com.mikeo.plasso.application.exceptions.BusinessValidationException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.files.DTO.CreateFolderRequest;
import com.mikeo.plasso.features.files.DTO.FileResponseDTO;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CreateFolder implements Command<FileController.CreateFolderCommand, FileResponseDTO> {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public CreateFolder(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<FileResponseDTO> execute(FileController.CreateFolderCommand input) {
        String userId = input.userId();
        String projectId = input.projectId();
        CreateFolderRequest request = input.request();

        // Verify user and project access
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Check access
        boolean hasAccess = project.getOwner().getId().equals(userId) ||
                project.getCollaborators().stream()
                        .anyMatch(collab -> collab.getId().equals(userId));

        if (!hasAccess) {
            throw new AccessDeniedException("You don't have access to this project");
        }

        // Get parent folder if specified
        ProjectFile parent = null;
        if (request.getParentId() != null && !request.getParentId().isEmpty()) {
            parent = fileRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent folder not found"));
        }

        // Check if folder name already exists
        if (fileRepository.existsByProjectIdAndParentIdAndName(
                projectId,
                request.getParentId(),
                request.getName())) {
            throw new BusinessValidationException("Folder with this name already exists");
        }

        // Create folder
        ProjectFile folder = new ProjectFile();
        folder.setName(request.getName());
        folder.setParent(parent);
        folder.setProject(project);
        folder.setFolder(true);

        folder = fileRepository.save(folder);

        return ResponseEntity.ok(mapToDTO(folder));
    }

    private FileResponseDTO mapToDTO(ProjectFile file) {
        FileResponseDTO dto = new FileResponseDTO();
        dto.setId(file.getId());
        dto.setName(file.getName());
        dto.setFolder(file.isFolder());
        dto.setParentId(file.getParent() != null ? file.getParent().getId() : null);
        return dto;
    }
}
