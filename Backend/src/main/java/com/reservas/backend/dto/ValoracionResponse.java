package com.reservas.backend.dto;

import com.reservas.backend.model.Valoracion;

import java.time.LocalDate;

public record ValoracionResponse(
        Long id,
        int puntuacion,
        String comentario,
        LocalDate fecha,
        Long usuarioId,
        String usuario
) {

    public static ValoracionResponse desde(Valoracion v) {
        return new ValoracionResponse(v.getId(), v.getPuntuacion(),
                v.getComentario() == null ? "" : v.getComentario(),
                v.getFecha(), v.getUsuario().getId(), v.getUsuario().getNombre());
    }
}
