package com.reservas.backend.exception;

import org.springframework.http.HttpStatus;

// 400: datos que no cumplen una regla de negocio (las validaciones de formato las hace @Valid)
public class SolicitudInvalidaException extends ApiException {

    public SolicitudInvalidaException(String mensaje) {
        super(HttpStatus.BAD_REQUEST, mensaje);
    }
}
