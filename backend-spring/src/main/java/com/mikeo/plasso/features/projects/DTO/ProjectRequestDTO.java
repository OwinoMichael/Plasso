package com.mikeo.plasso.features.projects.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProjectRequestDTO {


    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 1000)
    @Column(name = "description", length = 1000)
    private String description;

    @Size(max = 50)
    @Column(name = "language", length = 50)
    private String language;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = false;

    @Column(name = "auto_generate", nullable = false)
    private boolean autoGenerate = true;

    public ProjectRequestDTO() {
    }

    public ProjectRequestDTO(boolean autoGenerate, String description, String language, String name, boolean isPublic ) {
        this.autoGenerate = autoGenerate;
        this.description = description;
        this.language = language;
        this.name = name;
        this.isPublic = isPublic;

    }



    public @NotBlank @Size(max = 100) String getName() {
        return name;
    }

    public void setName(@NotBlank @Size(max = 100) String name) {
        this.name = name;
    }

    public @Size(max = 1000) String getDescription() {
        return description;
    }

    public void setDescription(@Size(max = 1000) String description) {
        this.description = description;
    }

    public @Size(max = 50) String getLanguage() {
        return language;
    }

    public void setLanguage(@Size(max = 50) String language) {
        this.language = language;
    }

    public boolean isAutoGenerate() {
        return autoGenerate;
    }

    public void setAutoGenerate(boolean autoGenerate) {
        this.autoGenerate = autoGenerate;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }
}
