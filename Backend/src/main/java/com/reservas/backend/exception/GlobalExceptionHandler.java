package com.reservas.backend.exception;

import com.reservas.backend.dto.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

// Maneja todas las excepciones en un solo lugar y responde siempre con el mismo formato (ApiError)
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // nuestras excepciones: 404, 409, 400, 401, 403
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApiException(ApiException ex) {
        return construir(ex.getStatus(), ex.getMessage(), Map.of());
    }

    // falló alguna anotación de @Valid (@NotBlank, @Email, @Size...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return construir(HttpStatus.BAD_REQUEST, "Hay datos inválidos en la solicitud", errores);
    }

    // JSON mal formado, fechas con formato incorrecto, enum inexistente...
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleBodyIlegible(HttpMessageNotReadableException ex) {
        return construir(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es válido", Map.of());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTipoIncorrecto(MethodArgumentTypeMismatchException ex) {
        return construir(HttpStatus.BAD_REQUEST, "El parámetro '" + ex.getName() + "' no es válido", Map.of());
    }

    // las reglas de @PreAuthorize lanzan estas excepciones desde el controller, por eso se atienden acá
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccesoDenegado(AccessDeniedException ex) {
        return construir(HttpStatus.FORBIDDEN, "No tenés permisos para realizar esta acción", Map.of());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleNoAutenticado(AuthenticationException ex) {
        return construir(HttpStatus.UNAUTHORIZED, "Tenés que iniciar sesión para realizar esta acción", Map.of());
    }

    // última defensa de la base de datos (por ejemplo dos registros simultáneos con el mismo correo)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleIntegridad(DataIntegrityViolationException ex) {
        log.warn("Violación de integridad en la base de datos: {}", ex.getMostSpecificCause().getMessage());
        return construir(HttpStatus.CONFLICT, "La operación entra en conflicto con datos ya existentes", Map.of());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> handleRutaInexistente(NoResourceFoundException ex) {
        return construir(HttpStatus.NOT_FOUND, "El recurso solicitado no existe", Map.of());
    }

    // cualquier otra cosa es un error nuestro: se registra completo y al cliente le damos un mensaje genérico
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleError(Exception ex) {
        // errores estándar de Spring MVC (método no permitido, falta un parámetro...) ya traen su código HTTP
        if (ex instanceof org.springframework.web.ErrorResponse errorSpring) {
            HttpStatus status = HttpStatus.valueOf(errorSpring.getStatusCode().value());
            return construir(status, "No se pudo procesar la solicitud", Map.of());
        }

        log.error("Error inesperado", ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado. Probá de nuevo más tarde.", Map.of());
    }

    private ResponseEntity<ApiError> construir(HttpStatus status, String mensaje, Map<String, String> errores) {
        ApiError cuerpo = new ApiError(LocalDateTime.now(), status.value(), status.getReasonPhrase(), mensaje, errores);
        return ResponseEntity.status(status).body(cuerpo);
    }
}
