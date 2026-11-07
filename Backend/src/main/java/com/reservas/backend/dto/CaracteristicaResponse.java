package com.reservas.backend.dto;

import com.reservas.backend.model.Feature;

public record CaracteristicaResponse(Long id, String nombre, String icono) {

    public static CaracteristicaResponse desde(Feature f) {
        return new CaracteristicaResponse(f.getId(), f.getNombre(), f.getIcono());
    }
}
