package com.reservas.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "hoteles")
@Getter
@Setter
@NoArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String ciudad;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 1000)
    private String imagen;

    // teléfono de contacto (solo números, con código de país) para el botón de WhatsApp
    private String telefono;

    // la categoría es una relación real con la tabla categorias
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "hotel_caracteristica",
        joinColumns = @JoinColumn(name = "hotel_id"),
        inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private Set<Feature> caracteristicas = new HashSet<>();

    // Relaciones bidireccionales: al borrar un hotel se borran también sus valoraciones y favoritos.
    // Las reservas NO se borran en cascada: un hotel con reservas no se puede eliminar.
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Valoracion> valoraciones = new ArrayList<>();

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Favorito> favoritos = new ArrayList<>();
}
