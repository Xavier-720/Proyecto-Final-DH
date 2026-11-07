package com.reservas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El título es obligatorio")
        @Size(max = 100, message = "El título puede tener hasta 100 caracteres")
        String titulo,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 500, message = "La descripción puede tener hasta 500 caracteres")
        String descripcion,

        @NotBlank(message = "La imagen es obligatoria")
        @Size(max = 1000, message = "La URL de la imagen es demasiado larga")
        String imagen
) {}
