package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotValidException extends CustomBaseException{


    public ResourceNotValidException(String resourceName){
        super(HttpStatus.BAD_REQUEST, new ErrorResponse("Invalid" + resourceName, HttpStatus.BAD_REQUEST.toString()));
    }
}
