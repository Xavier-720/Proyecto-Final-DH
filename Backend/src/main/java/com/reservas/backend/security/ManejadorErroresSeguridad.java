package com.reservas.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

// Los errores de seguridad se producen en los filtros, antes de llegar a los controllers,
// por eso el @RestControllerAdvice no los alcanza. Acá se responde con el mismo formato que ApiError.
@Component
public class ManejadorErroresSeguridad implements AuthenticationEntryPoint, AccessDeniedHandler {

    // sin token o con token inválido -> 401
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException ex) throws IOException {
        escribir(response, 401, "Unauthorized", "Tenés que iniciar sesión para realizar esta acción");
    }

    // con token válido pero sin el rol necesario -> 403
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {
        escribir(response, 403, "Forbidden", "No tenés permisos para realizar esta acción");
    }

    private void escribir(HttpServletResponse response, int status, String error, String mensaje) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        // los textos son fijos, no hace falta escapar nada
        String json = String.format(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\",\"mensaje\":\"%s\",\"errores\":{}}",
                LocalDateTime.now(), status, error, mensaje);
        response.getWriter().write(json);
    }
}
