package com.reservas.backend.service;

import com.reservas.backend.dto.UsuarioResponse;
import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.exception.SolicitudInvalidaException;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // lista de usuarios para el panel de admin (US#16)
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioResponse::desde).toList();
    }

    @Transactional
    public UsuarioResponse cambiarRol(Long id, Usuario.Rol nuevoRol, String emailQuienCambia) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        // para que el sistema no se quede sin administradores
        if (usuario.getEmail().equals(emailQuienCambia) && nuevoRol != Usuario.Rol.ADMIN) {
            throw new SolicitudInvalidaException("No podés quitarte a vos mismo el rol de administrador");
        }

        usuario.setRol(nuevoRol);
        return UsuarioResponse.desde(usuarioRepository.save(usuario));
    }
}
