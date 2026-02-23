package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    boolean existsByName(String name);

    @Query("SELECT p FROM Project p WHERE p.owner.id = :userId")
    Page<Project> findByUser_Id(String userId, Pageable pageable);
}
