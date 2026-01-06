package com.mikeo.plasso.features.files.entity;


import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;

@MappedSuperclass
public abstract class AbstractEntity {

    @Version
    private Long version;
}
