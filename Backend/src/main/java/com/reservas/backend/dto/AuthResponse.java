package com.reservas.backend.dto;

import com.reservas.backend.model.Usuario;

// Respuesta de login y registro. Nunca incluye la contraseña.
public record AuthResponse(String token, Long id, String nombre, String email, String rol) {

    public static AuthResponse desde(Usuario usuario, String token) {
        return new AuthResponse(token, usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().name());
    }
}
