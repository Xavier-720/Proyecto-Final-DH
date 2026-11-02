package com.reservas.backend.controller;

import com.reservas.backend.dto.*;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.UsuarioRepository;
import com.reservas.backend.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@RequestBody RegistroRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // lista de usuarios para el panel de admin (US#16)
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    // cambia el rol: USER o ADMIN
    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<Usuario> cambiarRol(@PathVariable Long id, @RequestBody RolRequest request) {
        Usuario actualizado = authService.actualizarRol(id, request.getRol());
        return ResponseEntity.ok(actualizado);
    }
}
