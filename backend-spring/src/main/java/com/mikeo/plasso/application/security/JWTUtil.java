package com.mikeo.plasso.application.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JWTUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.ms}")
    private long EXPIRATION_MS;

    private SecretKey KEY;

    @PostConstruct
    public void init() {
        // Option 1: If the secret is a plain text string
        // KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        // Option 2: If the secret is Base64 encoded (recommended for JWT)
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        KEY = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email, String userId) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)  // Add userId as a claim
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(KEY, Jwts.SIG.HS512)
                .compact();
    }

    public String extractUserEmail(String token) {
        return Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String extractUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("userId", String.class);
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(KEY)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception ex) {
            System.out.println("Invalid token: " + ex.getMessage());
            return false;
        }
    }
}
