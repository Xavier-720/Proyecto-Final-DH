package com.reservas.backend.repository;

import com.reservas.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Método para buscar un usuario por su correo electrónico (útil para el Login)
    Optional<Usuario> findByEmail(String email);

    // Método para verificar si ya existe un correo registrado (útil para el Registro)
    boolean existsByEmail(String email);
}