package com.mikeo.plasso.features.collabWs.cachingWrites;

import com.mikeo.plasso.features.files.FileRepository;
import com.mikeo.plasso.features.collabWs.cachingWrites.FileContentBuffer;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class FileFlushScheduler {

    private final FileContentBuffer buffer;
    private final FileRepository fileRepository;

    public FileFlushScheduler(FileContentBuffer buffer, FileRepository fileRepository) {
        this.buffer = buffer;
        this.fileRepository = fileRepository;
    }

    @Scheduled(fixedDelay = 2000) // every 2 seconds
    public void flushDirtyFiles() {
        Map<String, FileContentBuffer.BufferedFile> dirty = buffer.drainDirty();
        if (dirty.isEmpty()) return;

        dirty.forEach((fileId, buf) -> {
            fileRepository.findById(fileId).ifPresent(file -> {
                file.setContent(buf.content());
                fileRepository.save(file);
            });
        });
    }

    @PreDestroy
    public void flushOnShutdown() {
        flushDirtyFiles();
    }
}