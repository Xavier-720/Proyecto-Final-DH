package com.reservas.backend.service;

import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.model.Favorito;
import com.reservas.backend.model.Hotel;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.FavoritoRepository;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// US#24 y US#25: favoritos guardados en el servidor
@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HotelRepository hotelRepository;

    // ids de los hoteles favoritos del usuario
    @Transactional(readOnly = true)
    public List<Long> listarIds(String emailUsuario) {
        return favoritoRepository.findHotelIdsByUsuarioEmail(emailUsuario);
    }

    // si ya estaba como favorito no hace nada
    @Transactional
    public void agregar(String emailUsuario, Long hotelId) {
        Usuario usuario = obtenerUsuario(emailUsuario);
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Hotel no encontrado"));

        if (favoritoRepository.existsByUsuarioIdAndHotelId(usuario.getId(), hotelId)) return;

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setHotel(hotel);
        favoritoRepository.save(favorito);
    }

    @Transactional
    public void quitar(String emailUsuario, Long hotelId) {
        Usuario usuario = obtenerUsuario(emailUsuario);
        favoritoRepository.deleteByUsuarioIdAndHotelId(usuario.getId(), hotelId);
    }

    private Usuario obtenerUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }
}
