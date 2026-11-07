package com.reservas.backend.controller;

import com.reservas.backend.dto.CaracteristicaRequest;
import com.reservas.backend.dto.CaracteristicaResponse;
import com.reservas.backend.service.CaracteristicaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@RequiredArgsConstructor
public class FeatureController {

    private final CaracteristicaService caracteristicaService;

    @GetMapping
    public ResponseEntity<List<CaracteristicaResponse>> listar() {
        return ResponseEntity.ok(caracteristicaService.listar());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CaracteristicaResponse> crear(@Valid @RequestBody CaracteristicaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(caracteristicaService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CaracteristicaResponse> editar(@PathVariable Long id,
                                                         @Valid @RequestBody CaracteristicaRequest request) {
        return ResponseEntity.ok(caracteristicaService.editar(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        caracteristicaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
