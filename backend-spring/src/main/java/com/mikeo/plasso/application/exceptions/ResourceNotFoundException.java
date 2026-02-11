package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends CustomBaseException{

    public ResourceNotFoundException(String resourceName) {
        super(HttpStatus.NOT_FOUND, new ErrorResponse(resourceName + " not found", HttpStatus.NOT_FOUND.toString()));
    }
}