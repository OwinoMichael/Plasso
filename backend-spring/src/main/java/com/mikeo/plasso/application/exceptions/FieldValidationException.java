package com.mikeo.plasso.application.exceptions;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class FieldValidationException extends CustomBaseException{

    private final Map<String, String> fieldErrors;

    public FieldValidationException(Map<String, String> fieldErrors) {
        super(HttpStatus.BAD_REQUEST,
                new ErrorResponse("Field validation failed",
                        "FIELD_VALIDATION_ERROR",
                        fieldErrors));
        this.fieldErrors = fieldErrors;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
}
