package com.reservas.backend.dto;

import java.time.LocalDate;

// fechas ocupadas de un hotel (sin datos de quién reservó), el home las usa para filtrar por disponibilidad
public record OcupacionResponse(Long hotelId, LocalDate fechaCheckIn, LocalDate fechaCheckOut) {}
