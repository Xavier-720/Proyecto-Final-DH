package com.reservas.backend.dto;

import com.reservas.backend.model.Reserva;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaResponse(
        Long id,
        LocalDate fechaCheckIn,
        LocalDate fechaCheckOut,
        LocalDateTime fechaCreacion,
        HotelResumenResponse hotel
) {

    public static ReservaResponse desde(Reserva r) {
        return new ReservaResponse(r.getId(), r.getFechaCheckIn(), r.getFechaCheckOut(),
                r.getFechaCreacion(), HotelResumenResponse.desde(r.getHotel()));
    }
}
