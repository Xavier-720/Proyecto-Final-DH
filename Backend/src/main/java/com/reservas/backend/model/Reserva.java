package com.reservas.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Data
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // las fechas van como texto (yyyy-MM-dd)
    private String fechaCheckIn;
    private String fechaCheckOut;

    // cuando se hizo la reserva, se llena sola al guardar
    private LocalDateTime fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @PrePersist
    void antesDeGuardar() {
        fechaCreacion = LocalDateTime.now();
    }
}
