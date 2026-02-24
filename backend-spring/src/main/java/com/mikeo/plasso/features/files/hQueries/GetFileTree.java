package com.mikeo.plasso.features.files.hQueries;

import com.mikeo.plasso.Query;
import com.mikeo.plasso.application.exceptions.AccessDeniedException;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.files.DTO.FileTreeResponse;
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

import java.util.List;
import java.util.stream.Collectors;

// GetFileTree.java
@Service
@Transactional(readOnly = true)
public class GetFileTree implements Query<Pair<String, String>, List<FileTreeResponse>> {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final FileRepository fileRepository;

    public GetFileTree(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public ResponseEntity<List<FileTreeResponse>> execute(Pair<String, String> input) {
        String userId = input.getFirst();
        String projectId = input.getSecond();

        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify project exists and user has access
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Check if user is owner or collaborator
        boolean hasAccess = project.getOwner().getId().equals(userId) ||
                project.getCollaborators().stream()
                        .anyMatch(collab -> collab.getId().equals(userId));

        if (!hasAccess) {
            throw new AccessDeniedException("You don't have access to this project");
        }

        // Get all root-level files (parent is null)
        List<ProjectFile> rootFiles = fileRepository.findByProjectIdAndParentIsNull(projectId);

        // Build tree recursively
        List<FileTreeResponse> tree = rootFiles.stream()
                .map(this::buildFileTree)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tree);
    }

    private FileTreeResponse buildFileTree(ProjectFile file) {
        FileTreeResponse response = new FileTreeResponse(
                file.getId(),
                file.getName(),
                file.isFolder(),
                file.getLanguage(),
                file.isMainFile()
        );

        // If it's a folder, recursively build children
        if (file.isFolder() && file.getChildren() != null) {
            List<FileTreeResponse> childrenResponse = file.getChildren().stream()
                    .map(this::buildFileTree)
                    .collect(Collectors.toList());
            response.setChildren(childrenResponse);
        }

        return response;
    }
}
