import { request } from './api';

export const listarHoteles = () => request('/hoteles');

export const listarAleatorios = () => request('/hoteles/aleatorios');

export const obtenerHotel = (id) => request(`/hoteles/${id}`);

export const crearHotel = (hotel) => request('/hoteles', { method: 'POST', body: hotel });

export const actualizarHotel = (id, hotel) => request(`/hoteles/${id}`, { method: 'PUT', body: hotel });

export const eliminarHotel = (id) => request(`/hoteles/${id}`, { method: 'DELETE' });

// días ocupados de un hotel (yyyy-MM-dd) para el calendario
export const listarFechasOcupadas = (id) => request(`/hoteles/${id}/reservas`);
