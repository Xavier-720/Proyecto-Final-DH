package com.reservas.backend;

import com.reservas.backend.model.Categoria;
import com.reservas.backend.model.Feature;
import com.reservas.backend.model.Hotel;
import com.reservas.backend.model.Usuario;
import com.reservas.backend.repository.CategoriaRepository;
import com.reservas.backend.repository.FeatureRepository;
import com.reservas.backend.repository.HotelRepository;
import com.reservas.backend.repository.UsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            HotelRepository hotelRepo,
            FeatureRepository featureRepo,
            CategoriaRepository categoriaRepo,
            UsuarioRepository usuarioRepo,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password}") String adminPassword
    ) {
        return args -> {
            // El primer administrador se crea desde variables de entorno (ADMIN_EMAIL y ADMIN_PASSWORD).
            // Ya no se asigna el rol por el contenido del correo.
            if (!adminEmail.isBlank() && !adminPassword.isBlank()
                    && !usuarioRepo.existsByEmail(adminEmail.trim().toLowerCase())) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador");
                admin.setEmail(adminEmail.trim().toLowerCase());
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRol(Usuario.Rol.ADMIN);
                usuarioRepo.save(admin);
                log.info("Usuario administrador inicial creado: {}", admin.getEmail());
            }

            if (categoriaRepo.count() == 0) {
                categoriaRepo.saveAll(List.of(
                    new Categoria(null, "Café & Descanso", "Espacios acogedores con aroma a café y máxima tranquilidad.", "https://images.unsplash.com/photo-1554118811-1e0d58224f24"),
                    new Categoria(null, "Nocturnas", "Vibra nocturna, modernidad y cercanía a los mejores puntos de ocio.", "https://images.unsplash.com/photo-1514933651103-005eec06c04b"),
                    new Categoria(null, "Clásicos", "Tradición, elegancia y confort clásico europeo.", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"),
                    new Categoria(null, "Románticos", "Alojamientos íntimos pensados para parejas y escapadas en dos.", "https://images.unsplash.com/photo-1540555700478-4be289fbecef"),
                    new Categoria(null, "Aventura", "Cercanos a la naturaleza, montañas y actividades al aire libre.", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"),
                    new Categoria(null, "Lujo & Confort", "Máxima exclusividad, servicios premium y vistas de ensueño.", "https://images.unsplash.com/photo-1566073771259-6a8506099945")
                ));
            }

            if (featureRepo.count() == 0) {
                featureRepo.saveAll(List.of(
                    new Feature(null, "Wi-Fi gratis", "📶"),
                    new Feature(null, "Piscina", "🏊"),
                    new Feature(null, "Acepta mascotas", "🐾"),
                    new Feature(null, "Apto para niños", "👶"),
                    new Feature(null, "Estacionamiento gratuito", "🚗"),
                    new Feature(null, "Aire acondicionado", "❄️"),
                    new Feature(null, "Desayuno incluido", "☕"),
                    new Feature(null, "Gimnasio", "🏋️")
                ));
            }

            if (hotelRepo.count() == 0) {
                log.info("Generando 410 hoteles de prueba...");
                List<Feature> featuresDisponibles = featureRepo.findAll();

                String[] ciudades = {"Madrid", "Barcelona", "Buenos Aires", "Paris", "Berlin", "Roma", "Tokio", "Bogota", "Santiago", "Lima", "Londres", "New York", "Sidney", "Amsterdam", "Lisboa"};
                // las categorías ya están guardadas, se asignan por referencia (relación real)
                List<Categoria> categoriasDisponibles = categoriaRepo.findAll();

                String[] imagenesHotel = {
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
                    "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
                    "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427",
                    "https://images.unsplash.com/photo-1563911302283-d2bc129e7570",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
                    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
                    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd",
                    "https://images.unsplash.com/photo-1591088398332-8a7791972843",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
                    "https://images.unsplash.com/photo-1541971875076-8f970d573be6",
                    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f",
                    "https://images.unsplash.com/photo-1561501900-3701fa6a0864"
                };

                List<Hotel> listaHoteles = new ArrayList<>();
                Random random = new Random(1337); // semilla fija, sale siempre lo mismo

                for (int i = 1; i <= 410; i++) {
                    String ciudad = ciudades[random.nextInt(ciudades.length)];
                    Categoria categoria = categoriasDisponibles.get(random.nextInt(categoriasDisponibles.size()));
                    String imagen = imagenesHotel[random.nextInt(imagenesHotel.length)];

                    // entre 2 y 5 caracteristicas distintas por hotel
                    Set<Feature> caracteristicasAsignadas = new HashSet<>();
                    int cantidadFeatures = 2 + random.nextInt(4);

                    while (caracteristicasAsignadas.size() < cantidadFeatures && !featuresDisponibles.isEmpty()) {
                        Feature fRandom = featuresDisponibles.get(random.nextInt(featuresDisponibles.size()));
                        caracteristicasAsignadas.add(fRandom);
                    }

                    Hotel hotel = new Hotel();
                    hotel.setNombre("Grand Hotel " + i + " " + ciudad);
                    hotel.setCiudad(ciudad);
                    hotel.setDescripcion("Magnífico establecimiento hotelero número " + i + " situado en una zona privilegiada de " + ciudad + ", ideal para disfrutar al máximo.");
                    hotel.setCategoria(categoria);
                    hotel.setImagen(imagen);
                    hotel.setCaracteristicas(caracteristicasAsignadas);
                    listaHoteles.add(hotel);
                }

                hotelRepo.saveAll(listaHoteles);
                log.info("Listo, 410 hoteles creados");
            }
        };
    }
}