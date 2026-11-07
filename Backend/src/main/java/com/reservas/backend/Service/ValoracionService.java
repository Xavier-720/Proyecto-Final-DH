package com.reservas.backend.service;

import com.reservas.backend.dto.ResumenValoracionResponse;
import com.reservas.backend.dto.ValoracionRequest;
import com.reservas.backend.dto.ValoracionResponse;
import com.reservas.backend.exception.ConflictoException;
import com.reservas.backend.exception.PermisoDenegadoException;
import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.model.Hotel;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.model.Valoracion;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.ReservaRepository;
import com.reservas.backend.repository.UsuarioRepository;
import com.reservas.backend.repository.ValoracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ValoracionService {

    private final ValoracionRepository valoracionRepository;
    private final UsuarioRepository usuarioRepository;
    private final HotelRepository hotelRepository;
    private final ReservaRepository reservaRepository;

    // reseñas de un hotel
    @Transactional(readOnly = true)
    public List<ValoracionResponse> listarPorHotel(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new RecursoNoEncontradoException("Hotel no encontrado");
        }
        return valoracionRepository.findByHotelIdOrderByIdDesc(hotelId).stream()
                .map(ValoracionResponse::desde)
                .toList();
    }

    // solo puede puntuar quien reservó ese hotel, y una sola vez
    @Transactional
    public ValoracionResponse crear(Long hotelId, String emailUsuario, ValoracionRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Hotel no encontrado"));

        if (!reservaRepository.existsByUsuarioIdAndHotelId(usuario.getId(), hotelId)) {
            throw new PermisoDenegadoException("Solo podés puntuar alojamientos en los que hiciste una reserva");
        }
        if (valoracionRepository.existsByUsuarioIdAndHotelId(usuario.getId(), hotelId)) {
            throw new ConflictoException("Ya valoraste este alojamiento");
        }

        Valoracion valoracion = new Valoracion();
        valoracion.setUsuario(usuario);
        valoracion.setHotel(hotel);
        valoracion.setPuntuacion(request.puntuacion());
        valoracion.setComentario(request.comentario() == null ? null : request.comentario().trim());

        return ValoracionResponse.desde(valoracionRepository.save(valoracion));
    }

    // promedio y cantidad por hotel, indexado por id de hotel
    @Transactional(readOnly = true)
    public Map<Long, ResumenValoracionResponse> resumen() {
        Map<Long, ResumenValoracionResponse> resultado = new HashMap<>();

        for (ResumenValoracionResponse r : valoracionRepository.findResumenPorHotel()) {
            // redondeado a un decimal
            double promedio = Math.round(r.promedio() * 10) / 10.0;
            resultado.put(r.hotelId(), new ResumenValoracionResponse(r.hotelId(), promedio, r.total()));
        }
        return resultado;
    }
}
