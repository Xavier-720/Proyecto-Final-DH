package com.reservas.backend.exception;

import org.springframework.http.HttpStatus;

// 401: login con correo o contraseña incorrectos
public class CredencialesInvalidasException extends ApiException {

    public CredencialesInvalidasException() {
        super(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos");
    }
}
