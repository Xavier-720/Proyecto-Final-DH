package com.reservas.backend.controller;

import com.reservas.backend.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// favoritos del usuario logueado (todos los endpoints requieren token)
@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    // devuelve solo los ids de hotel
    @GetMapping
    public ResponseEntity<List<Long>> listar(Authentication authentication) {
        return ResponseEntity.ok(favoritoService.listarIds(authentication.getName()));
    }

    @PostMapping("/{hotelId}")
    public ResponseEntity<Void> agregar(@PathVariable Long hotelId, Authentication authentication) {
        favoritoService.agregar(authentication.getName(), hotelId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{hotelId}")
    public ResponseEntity<Void> quitar(@PathVariable Long hotelId, Authentication authentication) {
        favoritoService.quitar(authentication.getName(), hotelId);
        return ResponseEntity.noContent().build();
    }
}
