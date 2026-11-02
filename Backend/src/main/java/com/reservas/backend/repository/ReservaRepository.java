package com.reservas.backend.repository;

import com.reservas.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioId(Long usuarioId);

    List<Reserva> findByHotelId(Long hotelId);

    // para saber si el usuario reservo ese hotel (US#28)
    boolean existsByUsuarioIdAndHotelId(Long usuarioId, Long hotelId);
}
