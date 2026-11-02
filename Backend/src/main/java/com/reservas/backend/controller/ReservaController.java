package com.reservas.backend.controller;

import com.reservas.backend.model.Hotel;
import com.reservas.backend.model.Reserva;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.ReservaRepository;
import com.reservas.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final HotelRepository hotelRepository;

    // el mail es opcional
    @Autowired(required = false)
    private JavaMailSender mailSender;

    // US#32: crea la reserva y manda el mail de confirmacion (US#35)
    @PostMapping("/reservas")
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        if (reserva.getUsuario() == null || reserva.getUsuario().getId() == null
                || reserva.getHotel() == null || reserva.getHotel().getId() == null) {
            return ResponseEntity.badRequest().body("Faltan los datos del usuario o del hotel.");
        }

        LocalDate inicio = parsearFecha(reserva.getFechaCheckIn());
        LocalDate fin = parsearFecha(reserva.getFechaCheckOut());
        if (inicio == null || fin == null) {
            return ResponseEntity.badRequest().body("Las fechas no tienen un formato válido.");
        }
        if (!fin.isAfter(inicio)) {
            return ResponseEntity.badRequest().body("El check-out tiene que ser posterior al check-in.");
        }

        // del front llegan solo los ids, buscamos los datos completos
        Usuario usuario = usuarioRepository.findById(reserva.getUsuario().getId()).orElse(null);
        Hotel hotel = hotelRepository.findById(reserva.getHotel().getId()).orElse(null);
        if (usuario == null || hotel == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el usuario o el hotel.");
        }

        // que no se pise con otra reserva del mismo hotel
        for (Reserva existente : reservaRepository.findByHotelId(hotel.getId())) {
            LocalDate exInicio = parsearFecha(existente.getFechaCheckIn());
            LocalDate exFin = parsearFecha(existente.getFechaCheckOut());
            if (exInicio == null || exFin == null) continue;

            if (!inicio.isAfter(exFin) && !fin.isBefore(exInicio)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El hotel ya está reservado entre el " + exInicio + " y el " + exFin
                                + ". Elegí otras fechas.");
            }
        }

        reserva.setId(null);
        reserva.setUsuario(usuario);
        reserva.setHotel(hotel);
        Reserva nueva = reservaRepository.save(reserva);

        enviarCorreoConfirmacion(nueva);

        // devolvemos un resumen y no la entidad entera
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", nueva.getId(),
                "hotelId", hotel.getId(),
                "fechaCheckIn", nueva.getFechaCheckIn(),
                "fechaCheckOut", nueva.getFechaCheckOut()
        ));
    }

    // mis reservas (US#33)
    @GetMapping("/reservas/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaRepository.findByUsuarioId(usuarioId));
    }

    // fechas de todas las reservas, el home las usa para filtrar por disponibilidad
    @GetMapping("/reservas")
    public List<Map<String, Object>> listarOcupacion() {
        return reservaRepository.findAll().stream()
                .filter(r -> r.getHotel() != null && r.getFechaCheckIn() != null && r.getFechaCheckOut() != null)
                .map(r -> Map.<String, Object>of(
                        "hotelId", r.getHotel().getId(),
                        "fechaCheckIn", r.getFechaCheckIn(),
                        "fechaCheckOut", r.getFechaCheckOut()))
                .toList();
    }

    // dias ocupados de un hotel para el calendario (US#23)
    @GetMapping("/hoteles/{hotelId}/reservas")
    public ResponseEntity<List<String>> obtenerFechasOcupadasPorHotel(@PathVariable Long hotelId) {
        List<String> fechasOcupadas = new ArrayList<>();

        for (Reserva r : reservaRepository.findByHotelId(hotelId)) {
            LocalDate inicio = parsearFecha(r.getFechaCheckIn());
            LocalDate fin = parsearFecha(r.getFechaCheckOut());
            if (inicio == null || fin == null) continue;

            // se marcan todos los dias, incluido el de salida
            for (LocalDate dia = inicio; !dia.isAfter(fin); dia = dia.plusDays(1)) {
                fechasOcupadas.add(dia.toString());
            }
        }

        return ResponseEntity.ok(fechasOcupadas);
    }

    // null si la fecha viene vacia o mal escrita
    private LocalDate parsearFecha(String fecha) {
        try {
            return LocalDate.parse(fecha);
        } catch (Exception e) {
            return null;
        }
    }

    private void enviarCorreoConfirmacion(Reserva reserva) {
        if (mailSender == null || reserva.getUsuario().getEmail() == null) return;

        try {
            String reservadoEl = reserva.getFechaCreacion() != null
                    ? reserva.getFechaCreacion().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                    : "-";

            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(reserva.getUsuario().getEmail());
            mensaje.setSubject("Confirmación de tu reserva en Anteiku Stays - #" + reserva.getId());
            mensaje.setText("¡Hola " + reserva.getUsuario().getNombre() + "!\n\n"
                    + "Tu reserva fue confirmada.\n\n"
                    + "Alojamiento: " + reserva.getHotel().getNombre() + " (" + reserva.getHotel().getCiudad() + ")\n"
                    + "Check-in: " + reserva.getFechaCheckIn() + "\n"
                    + "Check-out: " + reserva.getFechaCheckOut() + "\n"
                    + "Reservado el: " + reservadoEl + "\n\n"
                    + "Si tenés dudas podés escribirle al proveedor por WhatsApp desde el sitio.\n\n"
                    + "¡Gracias por confiar en Anteiku Stays!");
            mailSender.send(mensaje);
        } catch (Exception e) {
            // si falla el mail la reserva igual queda hecha
            log.warn("No se pudo enviar el correo de la reserva {}: {}", reserva.getId(), e.getMessage());
        }
    }
}
