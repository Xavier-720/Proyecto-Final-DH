package com.reservas.backend.dto;

import lombok.Data;

@Data
public class ValoracionRequest {
    private Long usuarioId;
    private int puntuacion;
    private String comentario;
}
