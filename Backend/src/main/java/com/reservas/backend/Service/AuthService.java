package com.reservas.backend.Service;

import com.reservas.backend.dto.AuthResponse;
import com.reservas.backend.dto.LoginRequest;
import com.reservas.backend.dto.RegistroRequest;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    // si no hay correo configurado no se manda nada
    @Autowired(required = false)
    private JavaMailSender mailSender;

    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword());

        // los mails con "admin" quedan como administrador (para probar)
        if (request.getEmail().toLowerCase().contains("admin")) {
            usuario.setRol(Usuario.Rol.ADMIN);
        } else {
            usuario.setRol(Usuario.Rol.USER);
        }

        Usuario savedUser = usuarioRepository.save(usuario);
        enviarCorreoBienvenida(savedUser);

        return new AuthResponse(savedUser.getId(), savedUser.getNombre(), savedUser.getEmail(), savedUser.getRol().name());
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return new AuthResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol().name());
    }

    public Usuario actualizarRol(Long id, String nuevoRol) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setRol(Usuario.Rol.valueOf(nuevoRol.toUpperCase()));
        return usuarioRepository.save(usuario);
    }

    // US#19 (opcional): mail de bienvenida
    private void enviarCorreoBienvenida(Usuario usuario) {
        if (mailSender == null) return;

        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(usuario.getEmail());
            mensaje.setSubject("¡Bienvenido/a a Anteiku Stays!");
            mensaje.setText("¡Hola " + usuario.getNombre() + "!\n\n"
                    + "Tu cuenta se creó correctamente.\n\n"
                    + "Nombre: " + usuario.getNombre() + "\n"
                    + "Correo: " + usuario.getEmail() + "\n\n"
                    + "Ya podés iniciar sesión y reservar desde: http://localhost:5173\n\n"
                    + "Sentite como en tu hogar.");
            mailSender.send(mensaje);
        } catch (Exception e) {
            // si falla el mail no frenamos el registro
            log.warn("No se pudo enviar el correo de bienvenida a {}: {}", usuario.getEmail(), e.getMessage());
        }
    }
}
