package com.mikeo.plasso.features.collabWs;

import org.apache.poi.hssf.record.pivottable.PageItemRecord;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketSessionRegistry {

    public record ViewerInfo(String userId, String username) {}

    // fileId → Set of userIds currently viewing it
    private final ConcurrentHashMap<String, Set<ViewerInfo>> fileViewers = new ConcurrentHashMap<>();

    // sessionId → userId (for disconnect cleanup)
    private final ConcurrentHashMap<String, ViewerInfo> sessionToViewer = new ConcurrentHashMap<>();

    // sessionId → fileId
    private final ConcurrentHashMap<String, String> sessionToFile = new ConcurrentHashMap<>();

    private final ConcurrentHashMap<String, String> sessionToUsername = new ConcurrentHashMap<>();

    public void joinFile(String sessionId, String fileId, String userId, String username) {
        ViewerInfo viewer = new ViewerInfo(userId, username);
        fileViewers.computeIfAbsent(fileId, k -> ConcurrentHashMap.newKeySet()).add(viewer);
        sessionToViewer.put(sessionId, viewer);
        sessionToFile.put(sessionId, fileId);
    }

    public void leaveFile(String sessionId) {
        ViewerInfo viewer = sessionToViewer.remove(sessionId);
        String fileId = sessionToFile.remove(sessionId);
        if (fileId != null && viewer != null) {
            Set<ViewerInfo> viewers = fileViewers.get(fileId);
            if (viewers != null) {
                viewers.remove(viewer);
                if (viewers.isEmpty()) fileViewers.remove(fileId);
            }
        }
    }

    public Set<ViewerInfo> getViewers(String fileId) {
        return fileViewers.getOrDefault(fileId, Set.of());
    }

    public Optional<String> getFileForSession(String sessionId) {
        return Optional.ofNullable(sessionToFile.get(sessionId));
    }

    public Optional<String> getUserForSession(String sessionId) {
        return Optional.ofNullable(sessionToViewer.get(sessionId).userId);
    }
}