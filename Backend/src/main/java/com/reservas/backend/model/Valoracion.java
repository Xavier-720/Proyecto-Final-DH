package com.reservas.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

// un usuario puede valorar una sola vez cada hotel (restricción única en la base)
@Entity
@Table(name = "valoraciones",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "hotel_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Valoracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // de 1 a 5 estrellas
    private int puntuacion;

    @Column(length = 1000)
    private String comentario;

    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @PrePersist
    void antesDeGuardar() {
        fecha = LocalDate.now();
    }
}
