package com.reservas.backend.dto;

import com.reservas.backend.model.Hotel;

// datos mínimos del hotel para mostrar dentro de una reserva
public record HotelResumenResponse(Long id, String nombre, String ciudad, String imagen) {

    public static HotelResumenResponse desde(Hotel h) {
        return new HotelResumenResponse(h.getId(), h.getNombre(), h.getCiudad(), h.getImagen());
    }
}
