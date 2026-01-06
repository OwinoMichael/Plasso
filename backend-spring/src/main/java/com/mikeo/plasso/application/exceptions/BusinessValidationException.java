package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class BusinessValidationException extends CustomBaseException{

    public BusinessValidationException(String message) {
        super(HttpStatus.UNPROCESSABLE_ENTITY,
                new ErrorResponse(
                        "Validation error: " + message,
                        "BUSINESS_VALIDATION_FAILED"
                ));
    }

    public BusinessValidationException(String message, Map<String, Object> details) {
        super(HttpStatus.UNPROCESSABLE_ENTITY,
                new ErrorResponse(
                        "Validation error: " + message,
                        "BUSINESS_VALIDATION_FAILED",
                        details
                ));
    }

    public BusinessValidationException(String message, String errorCode, Map<String, Object> details) {
        super(HttpStatus.UNPROCESSABLE_ENTITY,
                new ErrorResponse(
                        message,
                        errorCode,
                        details
                ));
    }
}

