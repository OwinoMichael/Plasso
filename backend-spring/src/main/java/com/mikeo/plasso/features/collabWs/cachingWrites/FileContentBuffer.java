package com.mikeo.plasso.features.collabWs.cachingWrites;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FileContentBuffer {

    public record BufferedFile(String content, String lastEditorId, long lastModified, boolean dirty) {}

    private final ConcurrentHashMap<String, BufferedFile> buffer = new ConcurrentHashMap<>();

    public void update(String fileId, String content, String editorId) {
        buffer.put(fileId, new BufferedFile(content, editorId, System.currentTimeMillis(), true));
    }

    public Optional<String> getContent(String fileId) {
        return Optional.ofNullable(buffer.get(fileId)).map(BufferedFile::content);
    }

    // Returns only dirty entries (modified since last flush)
    public Map<String, BufferedFile> drainDirty() {
        Map<String, BufferedFile> dirty = new HashMap<>();
        buffer.forEach((fileId, buf) -> {
            if (buf.dirty()) {
                dirty.put(fileId, buf);
                buffer.put(fileId, new BufferedFile(buf.content(), buf.lastEditorId(), buf.lastModified(), false));
            }
        });
        return dirty;
    }
}
