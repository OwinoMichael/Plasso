package com.mikeo.plasso.features.collabWs;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketSessionRegistry {

    // fileId → Set of userIds currently viewing it
    private final ConcurrentHashMap<String, Set<String>> fileViewers = new ConcurrentHashMap<>();

    // sessionId → userId (for disconnect cleanup)
    private final ConcurrentHashMap<String, String> sessionToUser = new ConcurrentHashMap<>();

    // sessionId → fileId
    private final ConcurrentHashMap<String, String> sessionToFile = new ConcurrentHashMap<>();

    public void joinFile(String sessionId, String fileId, String userId) {
        fileViewers.computeIfAbsent(fileId, k -> ConcurrentHashMap.newKeySet()).add(userId);
        sessionToUser.put(sessionId, userId);
        sessionToFile.put(sessionId, fileId);
    }

    public void leaveFile(String sessionId) {
        String userId = sessionToUser.remove(sessionId);
        String fileId = sessionToFile.remove(sessionId);
        if (fileId != null && userId != null) {
            Set<String> viewers = fileViewers.get(fileId);
            if (viewers != null) {
                viewers.remove(userId);
                if (viewers.isEmpty()) fileViewers.remove(fileId);
            }
        }
    }

    public Set<String> getViewers(String fileId) {
        return fileViewers.getOrDefault(fileId, Set.of());
    }

    public Optional<String> getFileForSession(String sessionId) {
        return Optional.ofNullable(sessionToFile.get(sessionId));
    }

    public Optional<String> getUserForSession(String sessionId) {
        return Optional.ofNullable(sessionToUser.get(sessionId));
    }
}