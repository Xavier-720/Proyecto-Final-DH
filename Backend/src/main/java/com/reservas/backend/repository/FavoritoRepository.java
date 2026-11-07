package com.reservas.backend.repository;

import com.reservas.backend.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    // solo los ids de hotel, que es lo que necesita el frontend
    @Query("SELECT f.hotel.id FROM Favorito f WHERE f.usuario.email = :email")
    List<Long> findHotelIdsByUsuarioEmail(@Param("email") String email);

    boolean existsByUsuarioIdAndHotelId(Long usuarioId, Long hotelId);

    void deleteByUsuarioIdAndHotelId(Long usuarioId, Long hotelId);
}
