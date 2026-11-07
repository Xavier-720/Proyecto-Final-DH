package com.reservas.backend.exception;

import org.springframework.http.HttpStatus;

// Base de las excepciones propias. Cada subclase define con qué código HTTP se responde.
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;

    protected ApiException(HttpStatus status, String mensaje) {
        super(mensaje);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
