package com.mikeo.plasso.features.collabWs;

import com.mikeo.plasso.features.collabWs.cachingWrites.FileContentBuffer;
import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.files.entity.ProjectFile;
import com.mikeo.plasso.features.projects.ProjectRepository;
import com.mikeo.plasso.features.users.UserRepository;
import com.mikeo.plasso.features.users.entity.User;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate; //equivalent of returning responses, used in broadcasting messages
    private final WebSocketSessionRegistry sessionRegistry;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final FileContentBuffer buffer;

    public WebSocketController(FileContentBuffer buffer, SimpMessagingTemplate messagingTemplate, WebSocketSessionRegistry sessionRegistry, FileRepository fileRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.buffer = buffer;
        this.messagingTemplate = messagingTemplate;
        this.sessionRegistry = sessionRegistry;
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * Client joins a file view session.
     * Destination: /app/file.join
     */
    @MessageMapping("/file.join")
    public void joinFile(
            @Payload FilePresenceMessage msg,
            SimpMessageHeaderAccessor headerAccessor //Different from REST Which uses HTTPServletRequest
    ) {

        String sessionId = headerAccessor.getSessionId();
        sessionRegistry.joinFile(sessionId, msg.fileId(), msg.userId());

        // Broadcast updated presence to all viewers of this file
        Set<String> viewers = sessionRegistry.getViewers(msg.fileId());
        messagingTemplate.convertAndSend( // convertAndSendToUser - is PRIVATE MESSAGING - Send message ONLY to that user
                "/topic/project/" + msg.projectId() + "/file/" + msg.fileId() + "/presence",
                new PresenceBroadcast(msg.fileId(), viewers, "JOIN", msg.userId())
        );
    }

    /**
     * Client leaves a file view session.
     * Destination: /app/file.leave
     */
    @MessageMapping("/file.leave")
    public void leaveFile(
            @Payload FilePresenceMessage msg,
            SimpMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        sessionRegistry.leaveFile(sessionId);

        Set<String> viewers = sessionRegistry.getViewers(msg.fileId());
        messagingTemplate.convertAndSend(
                "/topic/project/" + msg.projectId() + "/file/" + msg.fileId() + "/presence",
                new PresenceBroadcast(msg.fileId(), viewers, "LEAVE", msg.userId())
        );
    }

    /**
     * Client sends a file edit (content change).
     * Destination: /app/file.edit
     * Broadcasts to: /topic/project/{projectId}/file/{fileId}/edits
     * Also persists to DB.
     *
     *
     * Collaborators don't need DB-fresh data — they get it from the broadcast directly
     * The only time DB content matters is on initial file load — so load from buffer first, fall back to DB:
     * */
    @MessageMapping("/file.edit")
    public void editFile(@Payload FileEditMessage msg) {

        // 1. Write to buffer (instant, no DB)
        buffer.update(msg.fileId(), msg.content(), msg.userId());

        // 2. Broadcast immediately to collaborators
        User editor = userRepository.findById(msg.userId()).orElseThrow();
        messagingTemplate.convertAndSend(
                "/topic/project/" + msg.projectId() + "/file/" + msg.fileId() + "/edits",
                new FileBroadcast(msg.fileId(), msg.userId(), editor.getUsername(), msg.content(), msg.timestamp())
        );

        // No save ack needed per keystroke anymore — flush scheduler handles it
    }
//    @MessageMapping("/file.edit")
//    public void editFile(@Payload FileEditMessage msg) {
//
//        // 1. Persist immediately via WebSocket (no REST needed)
//        ProjectFile file = fileRepository.findById(msg.fileId())
//                .orElseThrow(() -> new RuntimeException("File not found: " + msg.fileId()));
//
//        // Optional: verify user is owner or collaborator
//        boolean hasAccess = file.getProject().getOwner().getId().equals(msg.userId())
//                || file.getProject().getCollaborators().stream()
//                .anyMatch(u -> u.getId().equals(msg.userId()));
//
//        if (!hasAccess) {
//            messagingTemplate.convertAndSendToUser(
//                    msg.userId(), "/queue/errors",
//                    new SaveAck(msg.fileId(), false, "Access denied", System.currentTimeMillis())
//            );
//            return;
//        }
//
//        file.setContent(msg.content());
//        fileRepository.save(file);
//
//        // 2. Broadcast the edit to all viewers of this file
//        User editor = userRepository.findById(msg.userId()).orElseThrow();
//        messagingTemplate.convertAndSend(
//                "/topic/project/" + msg.projectId() + "/file/" + msg.fileId() + "/edits",
//                new FileBroadcast(
//                        msg.fileId(),
//                        msg.userId(),
//                        editor.getUsername(),
//                        msg.content(),
//                        msg.timestamp()
//                )
//        );
//
//        // 3. Send save ack back to the sender only
//        messagingTemplate.convertAndSendToUser(
//                msg.userId(), "/queue/ack",
//                new SaveAck(msg.fileId(), true, "Saved", System.currentTimeMillis())
//        );
//    }

    // Client sends this when they make an edit
    public record FileEditMessage(
            String fileId, String projectId,
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
