package com.reservas.backend.controller;

import com.reservas.backend.dto.OcupacionResponse;
import com.reservas.backend.dto.ReservaRequest;
import com.reservas.backend.dto.ReservaResponse;
import com.reservas.backend.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    // US#32: el usuario es el del token
    @PostMapping("/reservas")
    public ResponseEntity<ReservaResponse> crear(@Valid @RequestBody ReservaRequest request,
                                                 Authentication authentication) {
        ReservaResponse nueva = reservaService.crear(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    // mis reservas (US#33): solo devuelve las del usuario logueado
    @GetMapping("/reservas/mias")
    public ResponseEntity<List<ReservaResponse>> misReservas(Authentication authentication) {
        return ResponseEntity.ok(reservaService.listarDeUsuario(authentication.getName()));
    }

    // fechas de todas las reservas (público, sin datos de personas)
    @GetMapping("/reservas")
    public ResponseEntity<List<OcupacionResponse>> listarOcupacion() {
        return ResponseEntity.ok(reservaService.listarOcupacion());
    }

    // días ocupados de un hotel para el calendario (US#23)
    @GetMapping("/hoteles/{hotelId}/reservas")
    public ResponseEntity<List<LocalDate>> fechasOcupadas(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reservaService.fechasOcupadas(hotelId));
    }
}
