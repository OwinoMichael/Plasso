package com.mikeo.plasso.features.files.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.application.exceptions.AccessDeniedException;
import com.mikeo.plasso.application.exceptions.BusinessValidationException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DeleteFile implements Command<FileController.DeleteFileCommand, Void> {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;



    public DeleteFile(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<Void> execute(FileController.DeleteFileCommand input) {
        String userId = input.userId();
        String projectId = input.projectId();
        String fileId = input.fileId();

        // Verify user
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify project access
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        boolean hasAccess = project.getOwner().getId().equals(userId) ||
                project.getCollaborators().stream()
                        .anyMatch(collab -> collab.getId().equals(userId));

        if (!hasAccess) {
            throw new AccessDeniedException("You don't have access to this project");
        }

        // Get file to delete
        ProjectFile file = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        // Verify file belongs to project
        if (!file.getProject().getId().equals(projectId)) {
            throw new BusinessValidationException("File does not belong to this project");
        }

        // If deleting main file, unmark it (or set another file as main)
        if (file.isMainFile()) {
            // Option: Find another file to mark as main
            List<ProjectFile> otherFiles = fileRepository.findByProjectIdAndFolderFalseAndIdNot(projectId, fileId);
            if (!otherFiles.isEmpty()) {
                ProjectFile newMain = otherFiles.get(0);
                newMain.setMainFile(true);
                fileRepository.save(newMain);
            }
        }

        // Delete file (cascade will delete children if it's a folder)
        fileRepository.delete(file);

        return ResponseEntity.noContent().build();
    }
}
