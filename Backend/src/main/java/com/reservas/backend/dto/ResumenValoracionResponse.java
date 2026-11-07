package com.reservas.backend.dto;

// promedio y cantidad de valoraciones de un hotel. El constructor lo usa la consulta del repository.
public record ResumenValoracionResponse(Long hotelId, Double promedio, Long total) {}
