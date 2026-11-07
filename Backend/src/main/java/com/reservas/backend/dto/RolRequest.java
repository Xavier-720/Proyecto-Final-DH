package com.reservas.backend.dto;

import com.reservas.backend.model.Usuario;
import jakarta.validation.constraints.NotNull;

public record RolRequest(
        @NotNull(message = "El rol es obligatorio (USER o ADMIN)")
        Usuario.Rol rol
) {}
