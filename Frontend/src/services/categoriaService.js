import { request } from './api';

export const listarCategorias = () => request('/categorias');

export const crearCategoria = (categoria) => request('/categorias', { method: 'POST', body: categoria });

export const eliminarCategoria = (id) => request(`/categorias/${id}`, { method: 'DELETE' });
