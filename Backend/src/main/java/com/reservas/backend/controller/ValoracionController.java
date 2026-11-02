package com.reservas.backend.controller;

import com.reservas.backend.dto.ValoracionRequest;
import com.reservas.backend.model.Hotel;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.model.Valoracion;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.ReservaRepository;
import com.reservas.backend.repository.UsuarioRepository;
import com.reservas.backend.repository.ValoracionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ValoracionController {

    private final ValoracionRepository valoracionRepository;
    private final UsuarioRepository usuarioRepository;
    private final HotelRepository hotelRepository;
    private final ReservaRepository reservaRepository;

    // reseñas de un hotel
    @GetMapping("/hoteles/{hotelId}/valoraciones")
    public List<Map<String, Object>> listar(@PathVariable Long hotelId) {
        return valoracionRepository.findByHotelIdOrderByIdDesc(hotelId).stream()
                .map(v -> Map.<String, Object>of(
                        "id", v.getId(),
                        "puntuacion", v.getPuntuacion(),
                        "comentario", v.getComentario() == null ? "" : v.getComentario(),
                        "fecha", String.valueOf(v.getFecha()),
                        "usuario", String.valueOf(v.getUsuario().getNombre())))
                .toList();
    }

    // solo puede puntuar quien reservo ese hotel
    @PostMapping("/hoteles/{hotelId}/valoraciones")
    public ResponseEntity<?> crear(@PathVariable Long hotelId, @RequestBody ValoracionRequest datos) {
        if (datos.getPuntuacion() < 1 || datos.getPuntuacion() > 5) {
            return ResponseEntity.badRequest().body("La puntuación tiene que ser de 1 a 5.");
        }

        Usuario usuario = usuarioRepository.findById(datos.getUsuarioId()).orElse(null);
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (usuario == null || hotel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el usuario o el hotel.");
        }

        if (!reservaRepository.existsByUsuarioIdAndHotelId(usuario.getId(), hotelId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo podés puntuar alojamientos en los que hiciste una reserva.");
        }

        Valoracion valoracion = new Valoracion();
        valoracion.setUsuario(usuario);
        valoracion.setHotel(hotel);
        valoracion.setPuntuacion(datos.getPuntuacion());
        valoracion.setComentario(datos.getComentario());
        valoracionRepository.save(valoracion);

        return ResponseEntity.status(HttpStatus.CREATED).body("ok");
    }

    // promedio y cantidad por hotel, lo usa el home para mostrar las estrellas
    @GetMapping("/valoraciones/resumen")
    public Map<Long, Map<String, Object>> resumen() {
        Map<Long, List<Valoracion>> porHotel = valoracionRepository.findAll().stream()
                .filter(v -> v.getHotel() != null)
                .collect(Collectors.groupingBy(v -> v.getHotel().getId()));

        Map<Long, Map<String, Object>> resultado = new HashMap<>();
        porHotel.forEach((hotelId, lista) -> {
            double promedio = lista.stream().mapToInt(Valoracion::getPuntuacion).average().orElse(0);
            Map<String, Object> datos = new HashMap<>();
            datos.put("promedio", Math.round(promedio * 10) / 10.0);
            datos.put("total", lista.size());
            resultado.put(hotelId, datos);
        });
        return resultado;
    }
}
