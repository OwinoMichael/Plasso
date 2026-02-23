package com.mikeo.plasso.features.files.hCommands;


import com.mikeo.plasso.Command;
import com.mikeo.plasso.features.files.DTO.CreateFileRequest;
import com.mikeo.plasso.features.files.DTO.FileResponseDTO;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.users.UserRepository;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CreateFile implements Command<FileController.CreateFileCommand, FileResponseDTO> {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public CreateFile(FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }



    @Override
    public ResponseEntity<FileResponseDTO> execute(FileController.CreateFileCommand input) {
        return null;
    }
}
