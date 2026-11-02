package com.reservas.backend.controller;

import com.reservas.backend.model.Hotel;
import com.reservas.backend.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hoteles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HotelController {

    private final HotelRepository hotelRepository;

    @GetMapping
    public ResponseEntity<List<Hotel>> listarTodos() {
        return ResponseEntity.ok(hotelRepository.findAll());
    }

    // US#4: 10 hoteles al azar como maximo
    @GetMapping("/aleatorios")
    public ResponseEntity<List<Hotel>> listarAleatorios() {
        List<Hotel> hoteles = hotelRepository.findAll();
        Collections.shuffle(hoteles);
        return ResponseEntity.ok(hoteles.stream().limit(10).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> buscarPorId(@PathVariable Long id) {
        return hotelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearHotel(@RequestBody Hotel hotel) {
        // US#3: el nombre no se puede repetir
        if (hotelRepository.existsByNombreIgnoreCase(hotel.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un hotel con ese nombre.");
        }
        return ResponseEntity.ok(hotelRepository.save(hotel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarHotel(@PathVariable Long id, @RequestBody Hotel datos) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(id);
        if (hotelOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // se permite el mismo nombre solo si es el hotel que estamos editando
        if (hotelRepository.existsByNombreIgnoreCaseAndIdNot(datos.getNombre(), id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya existe un hotel con ese nombre.");
        }

        Hotel hotel = hotelOptional.get();
        hotel.setNombre(datos.getNombre());
        hotel.setCiudad(datos.getCiudad());
        hotel.setDescripcion(datos.getDescripcion());
        hotel.setCategoria(datos.getCategoria());
        hotel.setCaracteristicas(datos.getCaracteristicas());

        // si no mandan imagen queda la que tenia
        if (datos.getImagen() != null && !datos.getImagen().isBlank()) {
            hotel.setImagen(datos.getImagen());
        }

        return ResponseEntity.ok(hotelRepository.save(hotel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarHotel(@PathVariable Long id) {
        if (!hotelRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            hotelRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            // tiene reservas
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede eliminar: el hotel tiene reservas.");
        }
    }
}
