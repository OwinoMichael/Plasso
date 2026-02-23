package com.mikeo.plasso.features.files.hCommands;

import com.mikeo.plasso.Command;
import com.mikeo.plasso.features.files.FileController;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DeleteFile implements Command<FileController.DeleteFileCommand, Void> {

    private final FileRepository fileRepository;

    public DeleteFile(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public ResponseEntity<Void> execute(FileController.DeleteFileCommand input) {
        return null;
    }
}
