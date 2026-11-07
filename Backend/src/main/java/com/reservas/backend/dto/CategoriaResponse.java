package com.reservas.backend.dto;

import com.reservas.backend.model.Categoria;

public record CategoriaResponse(Long id, String titulo, String descripcion, String imagen) {

    public static CategoriaResponse desde(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getTitulo(), c.getDescripcion(), c.getImagen());
    }
}
