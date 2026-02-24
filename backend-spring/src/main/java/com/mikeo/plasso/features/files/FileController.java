package com.mikeo.plasso.features.files;


import com.mikeo.plasso.features.files.DTO.*;
import com.mikeo.plasso.features.files.hCommands.CreateFile;
import com.mikeo.plasso.features.files.hCommands.CreateFolder;
import com.mikeo.plasso.features.files.hCommands.DeleteFile;
import com.mikeo.plasso.features.files.hCommands.SetMainFile;
import com.mikeo.plasso.features.files.hQueries.GetFile;
import com.mikeo.plasso.features.files.hQueries.GetFileTree;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("projects/{projectsId}/files")
public class FileController {

    private final CreateFolder createFolder;
    private final CreateFile createFile;
    private final DeleteFile deleteFile;
    private final GetFileTree fileTree;
    private final SetMainFile setMainFile;
    private final GetFile getFile;

    public FileController(CreateFile createFile, CreateFolder createFolder, DeleteFile deleteFile, GetFileTree fileTree, SetMainFile setMainFile, GetFile getFile) {
        this.createFile = createFile;
        this.createFolder = createFolder;
        this.deleteFile = deleteFile;
        this.fileTree = fileTree;
        this.setMainFile = setMainFile;
        this.getFile = getFile;
    }

    public record CreateFileCommand(String userId, String projectId, CreateFileRequest request) {}
    public record CreateFolderCommand(String userId, String projectId, CreateFolderRequest request) {}
    public record DeleteFileCommand(String userId, String projectId, String fileId) {}
    public record SetMainFileCommand(String userId, String projectId, String fileId){}
    public record GetFileCommand(String userId, String projectId, String fileId){}

    @GetMapping("/file-tree")
    public ResponseEntity<List<FileTreeResponse>> getFileTree(
            @PathVariable String projectsId,
            HttpServletRequest httpRequest
    ){

        String userId = (String) httpRequest.getAttribute("userId");
        Pair<String, String> pairOfIds = Pair.of(userId, projectsId);

        return fileTree.execute(pairOfIds);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileResponseDTO> getFile(
            @PathVariable String projectsId,
            @PathVariable String fileId,
            HttpServletRequest request
    ){
        String userId = (String)  request.getAttribute("userId");

        GetFileCommand getFileCommand = new GetFileCommand(userId, projectsId, fileId);

        return getFile.execute(getFileCommand);
    }

    @PostMapping("/create-file")
    public ResponseEntity<FileResponseDTO> createFile(
            @PathVariable String projectsId,
            @RequestBody CreateFileRequest createFileRequest,
            HttpServletRequest httpRequest
            ){

        String userId = (String) httpRequest.getAttribute("userId");
        CreateFileCommand fileCommand = new CreateFileCommand(userId, projectsId, createFileRequest);
        return createFile.execute(fileCommand);

    }

    @PostMapping("/create-folder")
    public ResponseEntity<FileResponseDTO> createFolder(
            @PathVariable String projectsId,
            @RequestBody CreateFolderRequest createFolderRequest,
            HttpServletRequest httpRequest
    ){
        String userId = (String) httpRequest.getAttribute("userId");
        CreateFolderCommand folderCommand = new CreateFolderCommand(userId, projectsId, createFolderRequest);
        return createFolder.execute(folderCommand);
    }

    @PutMapping("/{fileId}/set-main")
    public ResponseEntity<FileResponseDTO> setMainFile(
            @PathVariable String projectsId,
            @PathVariable String fileId,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        SetMainFileCommand command = new SetMainFileCommand(userId, projectsId, fileId);
        return setMainFile.execute(command);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable String projectsId,
            @PathVariable String fileId,
            HttpServletRequest httpRequest
    ){
        String userId = (String) httpRequest.getAttribute("userId");
        DeleteFileCommand deleteFileCommand = new DeleteFileCommand(userId, projectsId, fileId);
        return deleteFile.execute(deleteFileCommand);
    }
}
