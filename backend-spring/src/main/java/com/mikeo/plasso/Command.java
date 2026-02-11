package com.mikeo.plasso;

import org.springframework.http.ResponseEntity;

public interface Command<I, T> {
    ResponseEntity<T> execute(I input);
}
