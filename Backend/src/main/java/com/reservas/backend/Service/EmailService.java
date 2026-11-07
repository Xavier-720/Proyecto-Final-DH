package com.reservas.backend.service;

import com.reservas.backend.model.Reserva;
import com.reservas.backend.model.Usuario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

// Envío de correos. Si falla el envío solo se registra el error: no corta el registro ni la reserva.
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    // si no hay correo configurado no se manda nada
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // US#19 (opcional): mail de bienvenida
    public void enviarBienvenida(Usuario usuario) {
        String texto = "¡Hola " + usuario.getNombre() + "!\n\n"
                + "Tu cuenta se creó correctamente.\n\n"
                + "Nombre: " + usuario.getNombre() + "\n"
                + "Correo: " + usuario.getEmail() + "\n\n"
                + "Ya podés iniciar sesión y reservar desde: " + frontendUrl + "\n\n"
                + "Sentite como en tu hogar.";

        enviar(usuario.getEmail(), "¡Bienvenido/a a Anteiku Stays!", texto);
    }

    // US#35: confirmación de la reserva
    public void enviarConfirmacionReserva(Reserva reserva) {
        String reservadoEl = reserva.getFechaCreacion() != null
                ? reserva.getFechaCreacion().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "-";

        String texto = "¡Hola " + reserva.getUsuario().getNombre() + "!\n\n"
                + "Tu reserva fue confirmada.\n\n"
                + "Alojamiento: " + reserva.getHotel().getNombre() + " (" + reserva.getHotel().getCiudad() + ")\n"
                + "Check-in: " + reserva.getFechaCheckIn() + "\n"
                + "Check-out: " + reserva.getFechaCheckOut() + "\n"
                + "Reservado el: " + reservadoEl + "\n\n"
                + "Si tenés dudas podés escribirle al proveedor por WhatsApp desde el sitio.\n\n"
                + "¡Gracias por confiar en Anteiku Stays!";

        enviar(reserva.getUsuario().getEmail(),
                "Confirmación de tu reserva en Anteiku Stays - #" + reserva.getId(), texto);
    }

    private void enviar(String destino, String asunto, String texto) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) return;

        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(destino);
            mensaje.setSubject(asunto);
            mensaje.setText(texto);
            mailSender.send(mensaje);
        } catch (Exception e) {
            log.warn("No se pudo enviar el correo '{}' a {}: {}", asunto, destino, e.getMessage());
        }
    }
}
