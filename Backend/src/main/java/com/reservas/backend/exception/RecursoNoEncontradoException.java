package com.reservas.backend.exception;

import org.springframework.http.HttpStatus;

// 404
public class RecursoNoEncontradoException extends ApiException {

    public RecursoNoEncontradoException(String mensaje) {
        super(HttpStatus.NOT_FOUND, mensaje);
    }
}
