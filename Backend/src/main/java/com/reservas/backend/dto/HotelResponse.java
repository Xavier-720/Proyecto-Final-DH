package com.reservas.backend.dto;

import com.reservas.backend.model.Feature;
import com.reservas.backend.model.Hotel;

import java.util.Comparator;
import java.util.List;

public record HotelResponse(
        Long id,
        String nombre,
        String ciudad,
        String descripcion,
        String imagen,
        String telefono,
        CategoriaResponse categoria,
        List<CaracteristicaResponse> caracteristicas
) {

    public static HotelResponse desde(Hotel h) {
        List<CaracteristicaResponse> caracteristicas = h.getCaracteristicas().stream()
                .sorted(Comparator.comparing(Feature::getId))
                .map(CaracteristicaResponse::desde)
                .toList();

        CategoriaResponse categoria = h.getCategoria() != null ? CategoriaResponse.desde(h.getCategoria()) : null;

        return new HotelResponse(h.getId(), h.getNombre(), h.getCiudad(), h.getDescripcion(),
                h.getImagen(), h.getTelefono(), categoria, caracteristicas);
    }
}
