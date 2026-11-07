package com.reservas.backend.repository;

import com.reservas.backend.dto.ResumenValoracionResponse;
import com.reservas.backend.model.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    // las más nuevas primero
    List<Valoracion> findByHotelIdOrderByIdDesc(Long hotelId);

    boolean existsByUsuarioIdAndHotelId(Long usuarioId, Long hotelId);

    // promedio y cantidad por hotel, lo usa el home para mostrar las estrellas
    @Query("SELECT new com.reservas.backend.dto.ResumenValoracionResponse(v.hotel.id, AVG(v.puntuacion), COUNT(v)) "
            + "FROM Valoracion v GROUP BY v.hotel.id")
    List<ResumenValoracionResponse> findResumenPorHotel();
}
