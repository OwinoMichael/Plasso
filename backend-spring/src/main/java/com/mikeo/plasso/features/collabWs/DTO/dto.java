package com.mikeo.plasso.features.collabWs.DTO;

import java.util.Set;

public class dto {

    // Client sends this when they make an edit
    public record FileEditMessage(
            String fileId,
            String projectId,
            String userId,
            String content,       // full content (simple approach)
            long timestamp
    ) {}

    // Server broadcasts this to all viewers
    public record FileBroadcast(
            String fileId,
            String editorUserId,
            String editorUsername,
            String content,
            long timestamp
    ) {}

    // Client sends when joining/leaving a file view
    public record FilePresenceMessage(
            String fileId,
            String projectId,
            String userId
    ) {}

    // Server broadcasts presence (who's viewing the file)
    public record PresenceBroadcast(
            String fileId,
            Set<String> viewerIds,
            String event,         // "JOIN" or "LEAVE"
            String userId
    ) {}

    // Server ack after persist
    public record SaveAck(
            String fileId,
            boolean success,
            String message,
            long savedAt
    ) {}
}
