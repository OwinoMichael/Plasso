package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

public class CustomBaseException extends RuntimeException{

    private HttpStatus httpStatus;
    private ErrorResponse errorResponse;

    public CustomBaseException(HttpStatus httpStatus, ErrorResponse errorResponse){
        this.httpStatus = httpStatus;
        this.errorResponse = errorResponse;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public ErrorResponse getErrorResponse() {
        return errorResponse;
    }

    public void setErrorResponse(ErrorResponse errorResponse) {
        this.errorResponse = errorResponse;
    }
}