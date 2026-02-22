package com.mikeo.plasso.features.projects.handleQueries;

import com.mikeo.plasso.Query;
import com.mikeo.plasso.application.exceptions.ResourceNotFoundException;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.projects.entity.Project;
import com.mikeo.plasso.features.users.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllProjects implements Query<UserProjectQueryParams, Page<Project>> {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public GetAllProjects(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<Page<Project>> execute(UserProjectQueryParams input) {
        String userId = input.getUserId();

        if(userId == null || userId.trim().isEmpty()){
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        String realId = userRepository.findById(userId)
                .orElseThrow(() -> {
                    new ResourceNotFoundException("");

                });


        return null;
    }
}
