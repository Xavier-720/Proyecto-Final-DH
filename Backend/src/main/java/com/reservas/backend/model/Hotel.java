package com.reservas.backend.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "hoteles")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String ciudad;
    
    @Column(length = 1000)
    private String descripcion;
    
    private String categoria;
    
    @Column(length = 1000)
    private String imagen;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "hotel_caracteristica",
        joinColumns = @JoinColumn(name = "hotel_id"),
        inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private Set<Feature> caracteristicas;

    public Hotel() {}

    public Hotel(Long id, String nombre, String ciudad, String descripcion, String categoria, String imagen, Set<Feature> caracteristicas) {
        this.id = id;
        this.nombre = nombre;
        this.ciudad = ciudad;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.imagen = imagen;
        this.caracteristicas = caracteristicas;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Set<Feature> getCaracteristicas() { return caracteristicas; }
    public void setCaracteristicas(Set<Feature> caracteristicas) { this.caracteristicas = caracteristicas; }
}