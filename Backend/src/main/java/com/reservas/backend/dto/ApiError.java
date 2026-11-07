package com.reservas.backend.dto;

import java.time.LocalDateTime;
import java.util.Map;

// Formato único para todas las respuestas de error de la API
public record ApiError(
        LocalDateTime timestamp,
        int status,
        String error,
        String mensaje,
        // errores por campo (solo en validaciones), vacío en el resto de los casos
        Map<String, String> errores
) {}
