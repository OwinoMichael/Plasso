package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

public class IllegalStateException extends CustomBaseException{
    public IllegalStateException(String resourceName) {
        super(HttpStatus.CONFLICT, new ErrorResponse(resourceName + " not found", HttpStatus.NOT_FOUND.toString()));
    }
}
