package com.reservas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CaracteristicaRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre puede tener hasta 100 caracteres")
        String nombre,

        @NotBlank(message = "El ícono es obligatorio")
        @Size(max = 10, message = "El ícono es demasiado largo")
        String icono
) {}
