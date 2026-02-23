package com.mikeo.plasso.features.files;

import com.mikeo.plasso.features.files.entity.ProjectFile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<ProjectFile, String> {
    List<ProjectFile> findByProjectIdAndParentIsNull(String projectId);
}
