# Anteiku Stay · Sistema de reservas de hotel

Aplicación web full stack para buscar hoteles, filtrar por categorías, reservar habitaciones, guardar favoritos y dejar valoraciones. Incluye un panel de administración para gestionar hoteles, categorías, características y usuarios.

**[Demo en vivo](https://anteikustay.netlify.app/)** · [Repositorio](https://github.com/Xavier-720/Proyecto-Final-DH)

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)

## Contenido

- [Características](#características)
- [Stack](#stack)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos](#requisitos)
- [Puesta en marcha local](#puesta-en-marcha-local)
- [API REST](#api-rest)
- [Rutas del frontend](#rutas-del-frontend)
- [Tests](#tests)
- [Migración desde una versión anterior](#migración-desde-una-versión-anterior)
- [Autores](#autores)

## Características

- **Explorar hoteles**: listado, detalle, hoteles aleatorios y filtros por categoría/características.
- **Reservas**: crear reservas desde el usuario autenticado y consultar las propias.
- **Favoritos y valoraciones**: guardar hoteles y opinar una vez por usuario y hotel.
- **Panel de administración**: alta, edición y baja de hoteles, categorías y características; cambio de roles de usuarios.
- **Autenticación JWT** con contraseñas hasheadas con BCrypt y rutas protegidas por rol.
- **Contacto directo**: botón de WhatsApp con número general configurable o teléfono propio de cada hotel.
- **Experiencia cuidada**: tema claro/oscuro, avisos al usuario y despliegue del frontend con fallback de rutas.

## Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | React · Vite · React Router DOM · Context API · CSS por componente |
| Backend | Java 17 · Spring Boot · Spring Security + JWT · Spring Validation · Spring Data JPA |
| Base de datos | MySQL |
| Build | Maven (wrapper incluido) y npm |
| Deploy | Netlify para la SPA · servidor API REST separado |

## Estructura del repositorio

```text
Proyecto-Final-DH/
├── Backend/
│   ├── .env.example
│   ├── pom.xml
│   └── src/main/java/com/reservas/backend/
│       ├── config/       # SecurityConfig y CORS
│       ├── controller/   # AUTH, hoteles, reservas, favoritos, valoraciones, admin
│       ├── dto/          # request/response de la API
│       ├── exception/    # manejo global de errores
│       ├── Model/        # entidades JPA
│       ├── Repository/   # repositorios Spring Data
│       ├── Service/      # lógica de negocio
│       └── DataInitializer.java
├── Frontend/
│   ├── public/_redirects # fallback de React Router en Netlify
│   └── src/              # componentes, páginas, contextos y estilos
└── README.md
```

## Requisitos

- Node.js 18 o superior.
- JDK 17 y Maven (se puede usar `./mvnw` incluido).
- MySQL en ejecución.
- Git.

## Puesta en marcha local

### 1. Backend

```bash
cd Backend
cp .env.example .env   # en Windows: Copy-Item .env.example .env
```

Completá el `.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/anteiku_db
DB_USERNAME=root
DB_PASSWORD=tu_password
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=contraseña_de_aplicacion_de_gmail
JWT_SECRET=<generar con: openssl rand -base64 32>
CORS_ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@correo.com
ADMIN_PASSWORD=una_password_segura
```

`JWT_SECRET` es obligatorio. `ADMIN_EMAIL` y `ADMIN_PASSWORD` crean el primer administrador al arrancar.

```bash
./mvnw spring-boot:run
```

API disponible en <http://localhost:8080>.

### 2. Frontend

En otra terminal:

```bash
cd Frontend
```

Creá `Frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WHATSAPP_NUMBER=5491123456789   # opcional
```

Después:

```bash
npm install
npm run dev
```

La SPA queda en <http://localhost:5173>.

## API REST

Los endpoints protegidos esperan `Authorization: Bearer <token>`. Los errores usan el formato `{ timestamp, status, error, mensaje, errores }`.

| Método | Endpoint | Descripción | Auth |
| --- | --- | --- | :--: |
| `POST` | `/api/auth/registro` | Registro (siempre rol USER) | No |
| `POST` | `/api/auth/login` | Login y token JWT | No |
| `GET` | `/api/hoteles`, `/api/hoteles/aleatorios`, `/api/hoteles/{id}` | Consultar hoteles | No |
| `POST` `PUT` `DELETE` | `/api/hoteles`, `/api/hoteles/{id}` | ABM de hoteles | ADMIN |
| `GET` `POST` `DELETE` | `/api/categorias`, `/api/caracteristicas` | ABM de catálogos | ADMIN / pública |
| `GET` | `/api/usuarios` | Listar usuarios | ADMIN |
| `PUT` | `/api/usuarios/{id}/rol` | Cambiar rol | ADMIN |
| `POST` | `/api/reservas` | Crear reserva | Sí |
| `GET` | `/api/reservas/mias` | Reservas del usuario | Sí |
| `GET` | `/api/hoteles/{id}/reservas` | Fechas ocupadas | No |
| `GET` `POST` | `/api/hoteles/{id}/valoraciones` | Reseñas y promedios | Sí / pública |
| `GET` `POST` `DELETE` | `/api/favoritos`, `/api/favoritos/{hotelId}` | Favoritos | Sí |

## Rutas del frontend

`/` · `/hoteles/:id` · `/hoteles/:id/reservar` · `/mis-reservas` · `/favoritos` · `/admin` (con `productos`, `categorias`, `caracteristicas`, `usuarios`). El archivo `Frontend/public/_redirects` permite recargar esas rutas en Netlify.

## Tests

```bash
# Backend
cd Backend && ./mvnw test

# Frontend
cd Frontend && npm run build   # verificación de compilación
```

El frontend todavía no tiene tests automatizados.

## Migración desde una versión anterior

Cambiaron tipos de columnas (fechas, categoría, contraseñas con hash) y `ddl-auto=update` no modifica columnas existentes. Si venís de una base vieja, borrá las tablas una sola vez:

```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS favoritos, valoraciones, reservas, hotel_caracteristica, hoteles, categorias, caracteristicas, usuarios;
SET FOREIGN_KEY_CHECKS = 1;
```

Las credenciales que estuvieron en el repositorio en el pasado deben cambiarse: siguen en el historial de Git aunque ya no estén en el código.

## Autores

- **Xavier Cuevas** — [@Xavier-720](https://github.com/Xavier-720)
- Equipo de desarrollo — Proyecto Integrador, Digital House.

Proyecto desarrollado con fines educativos para el programa Certified Tech Developer.
