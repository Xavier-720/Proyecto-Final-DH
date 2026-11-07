package com.reservas.backend.exception;

import org.springframework.http.HttpStatus;

// 403: el usuario está logueado pero no puede hacer esta acción
public class PermisoDenegadoException extends ApiException {

    public PermisoDenegadoException(String mensaje) {
        super(HttpStatus.FORBIDDEN, mensaje);
    }
}
