# 🏨 Anteiku Stay - Sistema de Reservas de Hotel

Aplicación web Full Stack para la búsqueda, gestión y reserva de habitaciones de hotel. Permite a los usuarios explorar hoteles disponibles, filtrar por categorías, gestionar sus reservas y guardar sus lugares favoritos. Incluye un panel de administración para gestionar productos, categorías y usuarios del sistema.

---

## ⚙️ Tecnologías

### 🖥️ Frontend
- React + Vite
- CSS3 (un archivo por componente/pantalla)
- React Router DOM (rutas, rutas protegidas por rol)
- Context API (sesión, tema, datos compartidos, favoritos, avisos)

### ☕ Backend
- Java 17
- Spring Boot
- Spring Security + JWT (contraseñas con BCrypt)
- Spring Validation (`@Valid`)
- Spring Data JPA
- MySQL
- Maven

---

## ☁️ Deploy & Demo en Vivo

- **Frontend:** Desplegado en **Netlify** → [https://anteikustay.netlify.app/](https://anteikustay.netlify.app/)
- **Backend:** Servidor de pruebas API REST

---

## 🚀 Instalación local

### 🧩 Requisitos previos
- Node.js (v18 o superior)
- Java JDK 17
- Git

### 📦 Clonar el repositorio
```bash
git clone https://github.com/Xavier-720/Proyecto-Final-DH.git
cd Proyecto-Final-DH
```

---

### 📁 Backend (`/Backend`)

1. Navegar a la carpeta del backend:
   ```bash
   cd Backend
   ```

2. Crear el archivo `.env` a partir de `.env.example` (no se sube a Git) y completar los datos:
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
   > `JWT_SECRET` es obligatorio. `ADMIN_EMAIL` y `ADMIN_PASSWORD` crean el primer administrador al arrancar
   > (el rol ya no se asigna por el contenido del correo). Los demás administradores se asignan desde el panel.
   > En producción las mismas variables se cargan como variables de entorno del servidor.

3. Ejecutar el servidor backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   > El Backend estará disponible en: `http://localhost:8080`

---

### 🖼️ Frontend (`/Frontend`)

1. Navegar a la carpeta del frontend:
   ```bash
   cd Frontend
   ```

2. Crear el archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

3. (Opcional) Teléfono general del botón de WhatsApp en el `.env`: `VITE_WHATSAPP_NUMBER=5491123456789`.
   Si un hotel tiene su propio teléfono (se carga desde el panel) se usa ese.

4. Instalar dependencias e iniciar el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
   > El Frontend estará disponible en: `http://localhost:5173`

---

## 📬 Endpoints (API REST)

Los endpoints protegidos esperan el header `Authorization: Bearer <token>`.
Todos los errores responden con el mismo formato: `{ timestamp, status, error, mensaje, errores }`.

| Método | Endpoint | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/registro` | Registro de usuario (siempre con rol USER) | ❌ |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener el token JWT | ❌ |
| `GET` | `/api/hoteles` · `/api/hoteles/aleatorios` · `/api/hoteles/{id}` | Consultar hoteles | ❌ |
| `POST` `PUT` `DELETE` | `/api/hoteles` · `/api/hoteles/{id}` | Alta, edición y baja de hoteles | ✅ ADMIN |
| `GET` | `/api/categorias` · `/api/caracteristicas` | Listados | ❌ |
| `POST` `DELETE` | `/api/categorias` · `/api/categorias/{id}` | Gestión de categorías | ✅ ADMIN |
| `POST` `PUT` `DELETE` | `/api/caracteristicas` · `/api/caracteristicas/{id}` | Gestión de características | ✅ ADMIN |
| `GET` | `/api/usuarios` | Listar usuarios | ✅ ADMIN |
| `PUT` | `/api/usuarios/{id}/rol` | Cambiar el rol de un usuario | ✅ ADMIN |
| `POST` | `/api/reservas` | Crear una reserva (el usuario sale del token) | ✅ |
| `GET` | `/api/reservas/mias` | Reservas del usuario logueado | ✅ |
| `GET` | `/api/reservas` · `/api/hoteles/{id}/reservas` | Fechas ocupadas (sin datos de personas) | ❌ |
| `GET` | `/api/hoteles/{id}/valoraciones` · `/api/valoraciones/resumen` | Reseñas y promedios | ❌ |
| `POST` | `/api/hoteles/{id}/valoraciones` | Valorar un hotel (una vez por usuario) | ✅ |
| `GET` `POST` `DELETE` | `/api/favoritos` · `/api/favoritos/{hotelId}` | Favoritos del usuario logueado | ✅ |

### Rutas del frontend

`/` · `/hoteles/:id` · `/hoteles/:id/reservar` · `/mis-reservas` · `/favoritos` · `/admin` (`/admin/productos`, `/admin/categorias`, `/admin/caracteristicas`, `/admin/usuarios`).
Para que funcione al recargar en Netlify se incluye `Frontend/public/_redirects`.

--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Registro de nuevo usuario | ❌ |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener token JWT | ❌ |
| `GET` | `/api/hoteles` | Listar todos los hoteles | ❌ |
| `GET` | `/api/hoteles/{id}` | Obtener detalle de un hotel | ❌ |
| `POST` | `/api/hoteles` | Crear un nuevo hotel | ✅ (ADMIN) |
| `DELETE` | `/api/hoteles/{id}` | Eliminar un hotel existente | ✅ (ADMIN) |
| `GET` | `/api/categorias` | Obtener categorías disponibles | ❌ |
| `POST` | `/api/reservas` | Realizar una reserva de habitación | ✅ (USER) |
| `GET` | `/api/reservas/usuario` | Ver historial de reservas del usuario | ✅ (USER) |

---

## 🗂️ Diagrama de Entidades (ER)

```plaintext
[USUARIOS] 1 --- * [RESERVAS] * --- 1 [HOTELES] * --- 1 [CATEGORIAS]
    |  1                                   | *
    *                                      * (valoraciones, favoritos, caracteristicas)
[VALORACIONES / FAVORITOS] * --- 1 [HOTELES] * --- * [CARACTERISTICAS]
```

---

## 🧪 Testing

### Backend
```bash
./mvnw test
```

### Frontend
Todavía no hay tests automatizados en el frontend.

---

## 🔄 Si venís de la versión anterior de la base de datos

Cambiaron tipos de columnas (fechas de reserva, categoría del hotel, contraseñas con hash), y `ddl-auto=update` no modifica columnas existentes.
Hay que borrar las tablas viejas una sola vez para que se regeneren y el `DataInitializer` vuelva a cargar los datos de prueba:

```sql
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS favoritos, valoraciones, reservas, hotel_caracteristica, hoteles, categorias, caracteristicas, usuarios;
SET FOREIGN_KEY_CHECKS = 1;
```

Además, las credenciales que estaban en el repositorio (base de datos y contraseña de aplicación de Gmail) tienen que **cambiarse**: seguir en el historial de Git las deja expuestas aunque ya no estén en el código.

---

## 👤 Autores

- **Xavier Cuevas** - [@Xavier-720](https://github.com/Xavier-720)
- Equipo de Desarrollo - Proyecto Integrador Digital House

---

## 📄 Licencia

Proyecto desarrollado con fines educativos para el programa de Certified Tech Developer.