package com.reservas.backend.exception;

import org.springframework.http.HttpStatus;

// 409: duplicados, fechas ocupadas, recursos en uso...
public class ConflictoException extends ApiException {

    public ConflictoException(String mensaje) {
        super(HttpStatus.CONFLICT, mensaje);
    }
}
