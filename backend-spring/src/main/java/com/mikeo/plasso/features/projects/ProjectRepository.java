package com.mikeo.plasso.features.projects;

import com.mikeo.plasso.features.projects.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    boolean existsByName(String name);

    @Query("SELECT DISTINCT p FROM Project p " +
            "LEFT JOIN p.collaborators c " +
            "WHERE p.owner.id = :userId OR c.id = :userId")
    Page<Project> findProjectsByUserAccess(@Param("userId") String userId, Pageable pageable);

//    // Optional: If you also want to fetch collaborators eagerly
//    @Query("SELECT DISTINCT p FROM Project p " +
//            "LEFT JOIN FETCH p.collaborators " +
//            "WHERE p.owner.id = :userId OR c.id = :userId")
//    Page<Project> findProjectsByUserAccessWithCollaborators(@Param("userId") String userId, Pageable pageable);
}
