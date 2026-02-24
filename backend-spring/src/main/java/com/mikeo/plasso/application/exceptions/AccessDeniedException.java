package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

public class AccessDeniedException extends CustomBaseException{

    public AccessDeniedException(String resourceName) {
        super(HttpStatus.FORBIDDEN, new ErrorResponse("Invalid" + resourceName, HttpStatus.FORBIDDEN.toString()));
    }
}
