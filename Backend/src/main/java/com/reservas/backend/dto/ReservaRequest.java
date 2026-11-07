package com.reservas.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

// El usuario NO viene en el body: se toma del token, así nadie puede reservar a nombre de otro.
public record ReservaRequest(
        @NotNull(message = "El hotel es obligatorio")
        Long hotelId,

        @NotNull(message = "La fecha de check-in es obligatoria")
        @FutureOrPresent(message = "El check-in no puede ser una fecha pasada")
        LocalDate fechaCheckIn,

        @NotNull(message = "La fecha de check-out es obligatoria")
        LocalDate fechaCheckOut
) {}
