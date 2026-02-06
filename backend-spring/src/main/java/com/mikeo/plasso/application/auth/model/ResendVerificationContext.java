package com.mikeo.plasso.application.auth.model;

import jakarta.servlet.http.HttpServletRequest;

public class ResendVerificationContext {
    private final ResendVerificationRequest request;
    private final HttpServletRequest httpRequest;

    public ResendVerificationContext(ResendVerificationRequest request,
                                     HttpServletRequest httpRequest) {
        this.request = request;
        this.httpRequest = httpRequest;
    }

    // Getters
    public ResendVerificationRequest getRequest() {
        return request;
    }

    public HttpServletRequest getHttpRequest() {
        return httpRequest;
    }
}