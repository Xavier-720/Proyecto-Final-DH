package com.reservas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record HotelRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 150, message = "El nombre puede tener hasta 150 caracteres")
        String nombre,

        @NotBlank(message = "La ciudad es obligatoria")
        @Size(max = 100, message = "La ciudad puede tener hasta 100 caracteres")
        String ciudad,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 1000, message = "La descripción puede tener hasta 1000 caracteres")
        String descripcion,

        @NotNull(message = "La categoría es obligatoria")
        Long categoriaId,

        @Size(max = 1000, message = "La URL de la imagen es demasiado larga")
        String imagen,

        // opcional: solo números con código de país (ej: 5491123456789)
        @Pattern(regexp = "^$|^\\d{8,15}$", message = "El teléfono debe tener entre 8 y 15 números, sin símbolos")
        String telefono,

        Set<Long> caracteristicaIds
) {}
