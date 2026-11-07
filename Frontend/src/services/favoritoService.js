import { request } from './api';

// ids de los hoteles favoritos del usuario logueado
export const listarFavoritos = () => request('/favoritos');

export const agregarFavorito = (hotelId) => request(`/favoritos/${hotelId}`, { method: 'POST' });

export const quitarFavorito = (hotelId) => request(`/favoritos/${hotelId}`, { method: 'DELETE' });
