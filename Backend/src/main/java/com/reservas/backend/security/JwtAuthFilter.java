package com.reservas.backend.security;

import com.reservas.backend.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// En cada request mira si viene un token en el header Authorization: Bearer <token>.
// Si es válido, deja al usuario autenticado. Si no, la request sigue como anónima
// y Spring Security decide si el endpoint la permite o no.
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtService.esValido(token)) {
                String email = jwtService.extraerEmail(token);

                // el rol se lee de la base y no del token, así un cambio de rol se aplica enseguida
                usuarioRepository.findByEmail(email).ifPresent(usuario -> {
                    var autoridad = new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name());
                    var autenticacion = new UsernamePasswordAuthenticationToken(
                            usuario.getEmail(), null, List.of(autoridad));
                    SecurityContextHolder.getContext().setAuthentication(autenticacion);
                });
            }
        }

        chain.doFilter(request, response);
    }
}
