package com.reservas.backend.repository;

import com.reservas.backend.model.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    // las mas nuevas primero
    List<Valoracion> findByHotelIdOrderByIdDesc(Long hotelId);
}
