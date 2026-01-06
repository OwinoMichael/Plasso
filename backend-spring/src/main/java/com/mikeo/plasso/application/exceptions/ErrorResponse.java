package com.mikeo.plasso.application.exceptions;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class ErrorResponse {
    private final String message;
    private final String errorCode;
    private final String timeStamp;
    private final Object details;


    // Constructor for simple message + error code
    public ErrorResponse(String message, String errorCode) {
        this(message, errorCode, null);
    }

    // Constructor for message + details (Map)
    public ErrorResponse(String message, Map<String, ?> details) {
        this(message, "VALIDATION_ERROR", details);
    }

    // Full constructor
    public ErrorResponse(String message, String errorCode, Object details) {
        this.message = message;
        this.errorCode = errorCode;
        this.timeStamp = DateTimeFormatter.ISO_INSTANT.format(Instant.now());
        this.details = details;
    }

    // Getters
    public String getMessage() {
        return message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public Object getDetails() {
        return details;
    }
}