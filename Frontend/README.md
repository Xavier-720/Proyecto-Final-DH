# Anteiku Stays

Sistema de reservas de hoteles hecho con Spring Boot (backend) y React + Vite (frontend).
Proyecto del desafío profesional.

## Cómo correrlo

Backend (necesita Java 17 y la base de datos configurada en `application.properties`):

    cd Backend
    ./mvnw spring-boot:run

El servidor queda en http://localhost:8080. La primera vez que arranca con la base vacía carga
categorías, características y 410 hoteles de prueba.

Frontend:

    cd Frontend
    npm install
    npm run dev

Se abre en http://localhost:5173.

## Qué se puede hacer

- Ver el listado de hoteles, buscar por ciudad, fechas y características, filtrar por categorías
- Registrarse, iniciar sesión y marcar favoritos
- Ver el detalle de un hotel con galería, calendario de disponibilidad, políticas y reseñas
- Reservar con un rango de fechas (llega un mail de confirmación) y ver el historial de reservas
- Puntuar los hoteles donde se reservó
- Panel de administración en `/administración` (solo usuarios admin): productos, categorías,
  características y usuarios

Si el mail de registro tiene la palabra "admin" el usuario queda como administrador.

## Estructura

    Backend/src/main/java/com/reservas/backend
      controller/   endpoints de la API
      model/        entidades (Hotel, Reserva, Usuario, Valoracion...)
      repository/   acceso a la base de datos
      Service/      lógica del login y registro
      dto/          objetos para recibir datos del front

    Frontend/src
      components/   pantallas y componentes (admin/ tiene el panel de administración)
      hooks/        useFavoritos
      services/     llamadas al backend y login
      utils/        funciones de fechas
