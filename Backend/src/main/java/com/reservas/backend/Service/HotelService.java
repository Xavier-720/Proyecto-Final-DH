package com.reservas.backend.service;

import com.reservas.backend.dto.HotelRequest;
import com.reservas.backend.dto.HotelResponse;
import com.reservas.backend.exception.ConflictoException;
import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.exception.SolicitudInvalidaException;
import com.reservas.backend.model.Categoria;
import com.reservas.backend.model.Feature;
import com.reservas.backend.model.Hotel;
import com.reservas.backend.repository.CategoriaRepository;
import com.reservas.backend.repository.FeatureRepository;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final CategoriaRepository categoriaRepository;
    private final FeatureRepository featureRepository;
    private final ReservaRepository reservaRepository;

    @Transactional(readOnly = true)
    public List<HotelResponse> listar() {
        return hotelRepository.findAllConDetalle().stream().map(HotelResponse::desde).toList();
    }

    // US#4: 10 hoteles al azar como máximo
    @Transactional(readOnly = true)
    public List<HotelResponse> listarAleatorios() {
        List<Hotel> hoteles = new ArrayList<>(hotelRepository.findAllConDetalle());
        Collections.shuffle(hoteles);
        return hoteles.stream().limit(10).map(HotelResponse::desde).toList();
    }

    @Transactional(readOnly = true)
    public HotelResponse buscarPorId(Long id) {
        return HotelResponse.desde(obtenerHotel(id));
    }

    @Transactional
    public HotelResponse crear(HotelRequest request) {
        // US#3: el nombre no se puede repetir
        if (hotelRepository.existsByNombreIgnoreCase(request.nombre().trim())) {
            throw new ConflictoException("Ya existe un hotel con ese nombre");
        }

        Hotel hotel = new Hotel();
        copiarDatos(hotel, request);
        return HotelResponse.desde(hotelRepository.save(hotel));
    }

    @Transactional
    public HotelResponse actualizar(Long id, HotelRequest request) {
        Hotel hotel = obtenerHotel(id);

        // se permite el mismo nombre solo si es el hotel que estamos editando
        if (hotelRepository.existsByNombreIgnoreCaseAndIdNot(request.nombre().trim(), id)) {
            throw new ConflictoException("Ya existe un hotel con ese nombre");
        }

        copiarDatos(hotel, request);
        return HotelResponse.desde(hotelRepository.save(hotel));
    }

    @Transactional
    public void eliminar(Long id) {
        Hotel hotel = obtenerHotel(id);

        if (reservaRepository.existsByHotelId(id)) {
            throw new ConflictoException("No se puede eliminar: el hotel tiene reservas");
        }

        // las valoraciones y los favoritos se borran solos por el cascade de la entidad
        hotelRepository.delete(hotel);
    }

    private Hotel obtenerHotel(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Hotel no encontrado"));
    }

    // pasa los datos del request al hotel (sirve para crear y para editar)
    private void copiarDatos(Hotel hotel, HotelRequest request) {
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new SolicitudInvalidaException("La categoría seleccionada no existe"));

        Set<Feature> caracteristicas = new HashSet<>();
        if (request.caracteristicaIds() != null && !request.caracteristicaIds().isEmpty()) {
            caracteristicas.addAll(featureRepository.findAllById(request.caracteristicaIds()));
            if (caracteristicas.size() != request.caracteristicaIds().size()) {
                throw new SolicitudInvalidaException("Alguna de las características seleccionadas no existe");
            }
        }

        hotel.setNombre(request.nombre().trim());
        hotel.setCiudad(request.ciudad().trim());
        hotel.setDescripcion(request.descripcion().trim());
        hotel.setCategoria(categoria);
        hotel.setCaracteristicas(caracteristicas);
        hotel.setTelefono(request.telefono() == null || request.telefono().isBlank() ? null : request.telefono());

        // si no mandan imagen queda la que tenía
        if (request.imagen() != null && !request.imagen().isBlank()) {
            hotel.setImagen(request.imagen().trim());
        }
    }
}
