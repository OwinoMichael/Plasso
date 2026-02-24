package com.mikeo.plasso.features.files.hQueries;


import com.mikeo.plasso.Query;
import com.mikeo.plasso.application.exceptions.AccessDeniedException;
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
public class GetFile implements Query<FileController.GetFileCommand, FileResponseDTO> {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public GetFile(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<FileResponseDTO> execute(FileController.GetFileCommand input) {
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

        ProjectFile file = fileRepository.findById(fileId).orElseThrow(() -> new ResourceNotFoundException("File not found"));


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
