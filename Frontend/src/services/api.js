// url base del backend, se puede cambiar con VITE_API_URL en un archivo .env
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const TOKEN_KEY = 'token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const guardarToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const borrarToken = () => localStorage.removeItem(TOKEN_KEY);

// error que lanzan todos los services, trae el mensaje listo para mostrar al usuario
export class ApiError extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Todas las llamadas al backend pasan por acá:
// agrega el token si hay sesión, convierte el body a JSON y arma el ApiError si algo sale mal.
export const request = async (ruta, { method = 'GET', body } = {}) => {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Probá de nuevo en unos minutos.');
  }

  // 204: respuesta sin contenido (por ejemplo al eliminar)
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // la respuesta no tenía JSON
  }

  if (!res.ok) {
    // token vencido o inválido: se avisa para cerrar la sesión
    if (res.status === 401 && token) {
      borrarToken();
      window.dispatchEvent(new Event('sesion-expirada'));
    }

    // si hay errores por campo (validaciones) se muestran todos juntos
    const detalle = data?.errores ? Object.values(data.errores).join('. ') : '';
    throw new ApiError(detalle || data?.mensaje || 'Ocurrió un error inesperado.', res.status);
  }

  return data;
};
