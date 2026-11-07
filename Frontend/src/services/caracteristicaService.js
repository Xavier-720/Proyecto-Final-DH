import { request } from './api';

export const listarCaracteristicas = () => request('/caracteristicas');

export const crearCaracteristica = (caracteristica) =>
  request('/caracteristicas', { method: 'POST', body: caracteristica });

export const editarCaracteristica = (id, caracteristica) =>
  request(`/caracteristicas/${id}`, { method: 'PUT', body: caracteristica });

export const eliminarCaracteristica = (id) => request(`/caracteristicas/${id}`, { method: 'DELETE' });
