package com.reservas.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// Igual que en las reservas, el usuario sale del token.
public record ValoracionRequest(
        @NotNull(message = "La puntuación es obligatoria")
        @Min(value = 1, message = "La puntuación mínima es 1")
        @Max(value = 5, message = "La puntuación máxima es 5")
        Integer puntuacion,

        @Size(max = 1000, message = "El comentario puede tener hasta 1000 caracteres")
        String comentario
) {}
