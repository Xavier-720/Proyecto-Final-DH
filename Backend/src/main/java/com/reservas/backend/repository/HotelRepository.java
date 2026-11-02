package com.reservas.backend.repository;

import com.reservas.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    // trae las caracteristicas junto con los hoteles para no hacer una consulta por cada uno
    @Query("SELECT DISTINCT h FROM Hotel h LEFT JOIN FETCH h.caracteristicas")
    List<Hotel> findAll();

    // para que no se repita el nombre (US#3)
    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}
