package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    boolean existsByName(String name);
}
