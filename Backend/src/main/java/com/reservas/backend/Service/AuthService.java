package com.reservas.backend.service;

import com.reservas.backend.dto.AuthResponse;
import com.reservas.backend.dto.LoginRequest;
import com.reservas.backend.dto.RegistroRequest;
import com.reservas.backend.exception.ConflictoException;
import com.reservas.backend.exception.CredencialesInvalidasException;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.UsuarioRepository;
import com.reservas.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthResponse registrar(RegistroRequest request) {
        String email = request.email().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new ConflictoException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre().trim());
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(request.password()));
        // todo usuario nuevo es USER. Para dar permisos de admin hay que hacerlo desde el panel (solo un admin puede)
        usuario.setRol(Usuario.Rol.USER);

        Usuario guardado = usuarioRepository.save(usuario);
        emailService.enviarBienvenida(guardado);

        return AuthResponse.desde(guardado, jwtService.generarToken(guardado));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();

        // mismo error si el correo no existe o la contraseña está mal, para no dar pistas
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(CredencialesInvalidasException::new);

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new CredencialesInvalidasException();
        }

        return AuthResponse.desde(usuario, jwtService.generarToken(usuario));
    }
}
