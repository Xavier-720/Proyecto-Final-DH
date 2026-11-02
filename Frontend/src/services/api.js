// url base del backend, se puede cambiar con VITE_API_URL en un archivo .env
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// saca el mensaje de error de una respuesta
// si el servidor mandó un json raro, se usa el mensaje por defecto
export const leerError = async (res, mensajePorDefecto) => {
  try {
    const texto = await res.text();
    if (texto && !texto.trim().startsWith('{')) return texto;
  } catch {
    // si no se puede leer el cuerpo, se devuelve el mensaje por defecto
  }
  return mensajePorDefecto;
};
