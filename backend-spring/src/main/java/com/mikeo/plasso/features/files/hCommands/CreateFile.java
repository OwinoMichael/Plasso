package com.mikeo.plasso.features.files.hCommands;


import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.AccessDeniedException;
import com.mikeo.plasso.application.exceptions.BusinessValidationException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.files.DTO.CreateFileRequest;
import com.mikeo.plasso.features.files.DTO.FileResponseDTO;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CreateFile implements Command<FileController.CreateFileCommand, FileResponseDTO> {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final CreateFolder createFolder;

    public CreateFile(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository, CreateFolder createFolder) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.createFolder = createFolder;
    }

    @Override
    public ResponseEntity<FileResponseDTO> execute(FileController.CreateFileCommand input) {
        String userId = input.userId();
        String projectId = input.projectId();
        CreateFileRequest request = input.request();

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Check if user is owner or collaborator
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

        // Check if file name already exists in same location
        if (fileRepository.existsByProjectIdAndParentIdAndName(
                projectId,
                request.getParentId(),
                request.getName())) {
            throw new BusinessValidationException("File with this name already exists in this location");
        }

        // Create file
        ProjectFile file = new ProjectFile();
        file.setName(request.getName());
        file.setParent(parent);
        file.setLanguage(request.getLanguage());
        file.setContent(request.getContent() != null ? request.getContent() : "");
        file.setProject(project);
        file.setFolder(false);
        file.setMainFile(false); // Default to false

        file = fileRepository.save(file);

        return ResponseEntity.ok(mapToDTO(file));
    }

    private FileResponseDTO mapToDTO(ProjectFile file) {
        FileResponseDTO dto = new FileResponseDTO();
        dto.setId(file.getId());
        dto.setName(file.getName());
        dto.setLanguage(file.getLanguage());
        dto.setFolder(file.isFolder());
        dto.setMainFile(file.isMainFile());
        dto.setContent(file.getContent());
        dto.setParentId(file.getParent() != null ? file.getParent().getId() : null);
        return dto;
    }
}
