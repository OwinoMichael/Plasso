package com.mikeo.plasso.application.auth.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service

public class RateLimitService {
    private final RedisTemplate<String, String> redisTemplate;

    public RateLimitService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }


    public boolean isAllowed(String serviceKey, String identifier) {
        String key = "rate_limit:" + serviceKey + ":" + identifier;

        // Increment and get current count
        Long count = redisTemplate.opsForValue().increment(key);

        // Set expiration (1 hour) if first request
        if (count != null && count == 1) {
            redisTemplate.expire(key, 1, TimeUnit.HOURS);
        }

        // Allow if under 5 requests
        return count != null && count <= 5;
    }
}
