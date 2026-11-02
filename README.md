# 🏨 Anteiku Stay - Sistema de Reservas de Hotel

Aplicación web Full Stack para la búsqueda, gestión y reserva de habitaciones de hotel. Permite a los usuarios explorar hoteles disponibles, filtrar por categorías, gestionar sus reservas y guardar sus lugares favoritos. Incluye un panel de administración para gestionar productos, categorías y usuarios del sistema.

---

## ⚙️ Tecnologías

### 🖥️ Frontend
- React 18 + Vite
- CSS Modules / CSS3
- Axios
- React Router DOM

### ☕ Backend
- Java 17
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- H2 Database / MySQL
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

2. Configurar el archivo de propiedades en `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/anteiku_db
   spring.datasource.username=root
   spring.datasource.password=123456
   ```

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

3. Instalar dependencias e iniciar el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
   > El Frontend estará disponible en: `http://localhost:5173`

---

## 📬 Endpoints (API REST)

| Método | Endpoint | Descripción | Auth |
| :--- | :--- | :--- | :---: |
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
[USUARIOS] 1 --- * [RESERVAS] * --- 1 [HOTELES]
   |                                     |
   *                                     *
[FAVORITOS]                         [CATEGORIAS]
```

---

## 🧪 Testing

### Backend
```bash
./mvnw test
```

### Frontend
```bash
npm run test
```

---

## 👤 Autores

- **Xavier Cuevas** - [@Xavier-720](https://github.com/Xavier-720)
- Equipo de Desarrollo - Proyecto Integrador Digital House

---

## 📄 Licencia

Proyecto desarrollado con fines educativos para el programa de Certified Tech Developer.