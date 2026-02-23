package com.mikeo.plasso.features.files.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.features.files.DTO.CreateFolderRequest;
import com.mikeo.plasso.features.files.DTO.FileResponseDTO;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CreateFolder implements Command<FileController.CreateFolderCommand, FileResponseDTO> {

    private final FileRepository fileRepository;

    public CreateFolder(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public ResponseEntity<FileResponseDTO> execute(FileController.CreateFolderCommand input) {
        return null;
    }
}
