package com.reservas.backend.repository;

import com.reservas.backend.dto.OcupacionResponse;
import com.reservas.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuarioEmailOrderByFechaCheckInDesc(String email);

    List<Reserva> findByHotelId(Long hotelId);

    boolean existsByHotelId(Long hotelId);

    // para saber si el usuario reservó ese hotel (US#28)
    boolean existsByUsuarioIdAndHotelId(Long usuarioId, Long hotelId);

    // Dos reservas se pisan si una empieza antes de que termine la otra y termina después de que empieza.
    // Con < y > (y no <= y >=) el día de check-out queda libre para el próximo huésped.
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.hotel.id = :hotelId "
            + "AND r.fechaCheckIn < :checkOut AND r.fechaCheckOut > :checkIn")
    boolean existeSolapamiento(@Param("hotelId") Long hotelId,
                               @Param("checkIn") LocalDate checkIn,
                               @Param("checkOut") LocalDate checkOut);

    @Query("SELECT new com.reservas.backend.dto.OcupacionResponse(r.hotel.id, r.fechaCheckIn, r.fechaCheckOut) FROM Reserva r")
    List<OcupacionResponse> findOcupacion();
}
