package com.reservas.backend.service;

import com.reservas.backend.dto.CategoriaRequest;
import com.reservas.backend.dto.CategoriaResponse;
import com.reservas.backend.exception.ConflictoException;
import com.reservas.backend.exception.RecursoNoEncontradoException;
import com.reservas.backend.model.Categoria;
import com.reservas.backend.repository.CategoriaRepository;
import com.reservas.backend.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final HotelRepository hotelRepository;

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll().stream().map(CategoriaResponse::desde).toList();
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        String titulo = request.titulo().trim();

        if (categoriaRepository.existsByTituloIgnoreCase(titulo)) {
            throw new ConflictoException("Ya existe una categoría con ese título");
        }

        Categoria categoria = new Categoria(null, titulo, request.descripcion().trim(), request.imagen().trim());
        return CategoriaResponse.desde(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException("Categoría no encontrada");
        }
        // como el hotel referencia a la categoría, no se puede borrar si está en uso
        if (hotelRepository.existsByCategoriaId(id)) {
            throw new ConflictoException("No se puede eliminar: hay hoteles asignados a esta categoría");
        }
        categoriaRepository.deleteById(id);
    }
}
