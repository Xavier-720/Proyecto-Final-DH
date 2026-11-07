package com.reservas.backend.controller;

import com.reservas.backend.dto.RolRequest;
import com.reservas.backend.dto.UsuarioResponse;
import com.reservas.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// gestión de usuarios (US#16): solo para administradores
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    // cambia el rol: USER o ADMIN
    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioResponse> cambiarRol(@PathVariable Long id,
                                                      @Valid @RequestBody RolRequest request,
                                                      Authentication authentication) {
        return ResponseEntity.ok(usuarioService.cambiarRol(id, request.rol(), authentication.getName()));
    }
}
