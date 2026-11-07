package com.reservas.backend.service;

import com.reservas.backend.dto.OcupacionResponse;
import com.reservas.backend.dto.ReservaRequest;
import com.reservas.backend.dto.ReservaResponse;
import com.reservas.backend.exception.ConflictoException;
import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.exception.SolicitudInvalidaException;
import com.reservas.backend.model.Hotel;
import com.reservas.backend.model.Reserva;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.ReservaRepository;
import com.reservas.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final HotelRepository hotelRepository;
    private final EmailService emailService;

    // US#32: crea la reserva y manda el mail de confirmación (US#35)
    // emailUsuario viene del token, no del body
    @Transactional
    public ReservaResponse crear(String emailUsuario, ReservaRequest request) {
        LocalDate checkIn = request.fechaCheckIn();
        LocalDate checkOut = request.fechaCheckOut();

        if (!checkOut.isAfter(checkIn)) {
            throw new SolicitudInvalidaException("El check-out tiene que ser posterior al check-in");
        }

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        Hotel hotel = hotelRepository.findById(request.hotelId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Hotel no encontrado"));

        // que no se pise con otra reserva del mismo hotel
        if (reservaRepository.existeSolapamiento(hotel.getId(), checkIn, checkOut)) {
            throw new ConflictoException("El hotel ya está reservado en esas fechas. Elegí otras fechas.");
        }

        Reserva reserva = new Reserva();
        reserva.setUsuario(usuario);
        reserva.setHotel(hotel);
        reserva.setFechaCheckIn(checkIn);
        reserva.setFechaCheckOut(checkOut);
        Reserva guardada = reservaRepository.save(reserva);

        emailService.enviarConfirmacionReserva(guardada);

        return ReservaResponse.desde(guardada);
    }

    // mis reservas (US#33)
    @Transactional(readOnly = true)
    public List<ReservaResponse> listarDeUsuario(String emailUsuario) {
        return reservaRepository.findByUsuarioEmailOrderByFechaCheckInDesc(emailUsuario).stream()
                .map(ReservaResponse::desde)
                .toList();
    }

    // fechas de todas las reservas, el home las usa para filtrar por disponibilidad
    @Transactional(readOnly = true)
    public List<OcupacionResponse> listarOcupacion() {
        return reservaRepository.findOcupacion();
    }

    // noches ocupadas de un hotel para el calendario (US#23)
    // datesUntil excluye el último día, así el día de check-out queda disponible
    @Transactional(readOnly = true)
    public List<LocalDate> fechasOcupadas(Long hotelId) {
        if (!hotelRepository.existsById(hotelId)) {
            throw new RecursoNoEncontradoException("Hotel no encontrado");
        }

        return reservaRepository.findByHotelId(hotelId).stream()
                .flatMap(r -> r.getFechaCheckIn().datesUntil(r.getFechaCheckOut()))
                .sorted()
                .toList();
    }
}
