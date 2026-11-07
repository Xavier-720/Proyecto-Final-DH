import { request } from './api';

export const listarUsuarios = () => request('/usuarios');

export const cambiarRol = (id, rol) => request(`/usuarios/${id}/rol`, { method: 'PUT', body: { rol } });
