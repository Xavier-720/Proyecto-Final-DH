import { request } from './api';

export const listarValoraciones = (hotelId) => request(`/hoteles/${hotelId}/valoraciones`);

export const crearValoracion = (hotelId, puntuacion, comentario) =>
  request(`/hoteles/${hotelId}/valoraciones`, { method: 'POST', body: { puntuacion, comentario } });

// promedio y cantidad por hotel: { [hotelId]: { promedio, total } }
export const obtenerResumenes = () => request('/valoraciones/resumen');
