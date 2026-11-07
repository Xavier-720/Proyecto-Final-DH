package com.reservas.backend.controller;

import com.reservas.backend.dto.ResumenValoracionResponse;
import com.reservas.backend.dto.ValoracionRequest;
import com.reservas.backend.dto.ValoracionResponse;
import com.reservas.backend.service.ValoracionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ValoracionController {

    private final ValoracionService valoracionService;

    @GetMapping("/hoteles/{hotelId}/valoraciones")
    public ResponseEntity<List<ValoracionResponse>> listar(@PathVariable Long hotelId) {
        return ResponseEntity.ok(valoracionService.listarPorHotel(hotelId));
    }

    // el usuario es el del token
    @PostMapping("/hoteles/{hotelId}/valoraciones")
    public ResponseEntity<ValoracionResponse> crear(@PathVariable Long hotelId,
                                                    @Valid @RequestBody ValoracionRequest request,
                                                    Authentication authentication) {
        ValoracionResponse nueva = valoracionService.crear(hotelId, authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    // promedio y cantidad por hotel, lo usa el home para mostrar las estrellas
    @GetMapping("/valoraciones/resumen")
    public ResponseEntity<Map<Long, ResumenValoracionResponse>> resumen() {
        return ResponseEntity.ok(valoracionService.resumen());
    }
}
