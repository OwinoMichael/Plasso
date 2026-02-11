package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;


public class FileStorageException extends CustomBaseException{
    public FileStorageException(String resourceName) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, new ErrorResponse(resourceName + " not found", HttpStatus.INTERNAL_SERVER_ERROR.toString()));
    }
}
