package com.mikeo.plasso.application.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTAuthenticationFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Skip JWT filter for public endpoints
        return path.equals("/login") ||
                path.equals("/createNewUser") ||
                path.equals("/verify") ||
                path.equals("/magic-link") ||
                path.equals("/verify-magic-link") ||
                path.equals("/resend-verification") ||
                path.startsWith("/ws/");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //token will be sent in header
        //Bearer [jwt]

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7); //Cuts of Bearer and space
        }

        //validate token
        if(token != null && jwtUtil.validateToken(token)){
            String email = jwtUtil.extractUserEmail(token);
            String userId = jwtUtil.extractUserId(token);  // Extract userId
            String username = jwtUtil.extractUsername(token);  // Extract username

            // Store userId in request attribute
            request.setAttribute("userId", userId);  // Make userId available

            Authentication auth = new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}