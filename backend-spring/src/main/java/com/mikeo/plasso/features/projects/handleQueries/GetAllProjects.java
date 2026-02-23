package com.mikeo.plasso.features.projects.handleQueries;

import com.mikeo.plasso.Query;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.projects.DTO.ProjectResponseDTO;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

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

        Pageable pageable = PageRequest.of(
                params.getPage(),
                params.getSize(),
                Sort.by(params.getSortDirection(),params.getSortBy())
        );

        Page<Project> page = projectRepository.findByUser_Id(userId, pageable);

        //Page<ProjectResponseDTO> pageDto = page.map(project -> this.mapToDTO(project));
        Page<ProjectResponseDTO> pageDto = page.map(this::mapToDTO);

        return ResponseEntity.ok(pageDto);
    }

    public ProjectResponseDTO mapToDTO(Project project){
        if(project == null) return null;

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
