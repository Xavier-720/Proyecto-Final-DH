package com.reservas.backend.service;

import com.reservas.backend.dto.CaracteristicaRequest;
import com.reservas.backend.dto.CaracteristicaResponse;
import com.reservas.backend.exception.ConflictoException;
import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.model.Feature;
import com.reservas.backend.repository.FeatureRepository;
import com.reservas.backend.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaracteristicaService {

    private final FeatureRepository featureRepository;
    private final HotelRepository hotelRepository;

    @Transactional(readOnly = true)
    public List<CaracteristicaResponse> listar() {
        return featureRepository.findAll().stream().map(CaracteristicaResponse::desde).toList();
    }

    @Transactional
    public CaracteristicaResponse crear(CaracteristicaRequest request) {
        Feature feature = new Feature(null, request.nombre().trim(), request.icono().trim());
        return CaracteristicaResponse.desde(featureRepository.save(feature));
    }

    @Transactional
    public CaracteristicaResponse editar(Long id, CaracteristicaRequest request) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Característica no encontrada"));

        feature.setNombre(request.nombre().trim());
        feature.setIcono(request.icono().trim());
        return CaracteristicaResponse.desde(featureRepository.save(feature));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!featureRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Característica no encontrada");
        }
        if (hotelRepository.existsByCaracteristicasId(id)) {
            throw new ConflictoException("No se puede eliminar: la característica está asignada a uno o más hoteles");
        }
        featureRepository.deleteById(id);
    }
}
