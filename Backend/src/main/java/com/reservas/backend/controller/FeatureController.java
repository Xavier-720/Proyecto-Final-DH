package com.reservas.backend.controller;

import com.reservas.backend.model.Feature;
import com.reservas.backend.repository.FeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeatureController {

    private final FeatureRepository featureRepository;

    @GetMapping
    public ResponseEntity<List<Feature>> listar() {
        return ResponseEntity.ok(featureRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Feature> crear(@RequestBody Feature feature) {
        return ResponseEntity.ok(featureRepository.save(feature));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feature> editar(@PathVariable Long id, @RequestBody Feature datos) {
        return featureRepository.findById(id)
                .map(f -> {
                    f.setNombre(datos.getNombre());
                    f.setIcono(datos.getIcono());
                    return ResponseEntity.ok(featureRepository.save(f));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        try {
            featureRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            // algun hotel la tiene asignada
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede eliminar: la característica está asignada a uno o más hoteles.");
        }
    }
}
