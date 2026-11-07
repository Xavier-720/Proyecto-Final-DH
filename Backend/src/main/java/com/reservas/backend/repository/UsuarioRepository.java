package com.reservas.backend.repository;

import com.reservas.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // para el login y para saber quién es el usuario del token
    Optional<Usuario> findByEmail(String email);

    // para el registro
    boolean existsByEmail(String email);
}
