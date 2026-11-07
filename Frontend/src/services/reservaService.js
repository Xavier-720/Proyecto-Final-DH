import { request } from './api';

// el usuario sale del token, no se manda en el body
export const crearReserva = (hotelId, fechaCheckIn, fechaCheckOut) =>
  request('/reservas', { method: 'POST', body: { hotelId, fechaCheckIn, fechaCheckOut } });

export const listarMisReservas = () => request('/reservas/mias');

// fechas de todas las reservas, para filtrar el home por disponibilidad
export const listarOcupacion = () => request('/reservas');
