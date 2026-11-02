import { API_URL } from './api';

const AUTH_URL = `${API_URL}/auth`;

// hace el post y guarda al usuario en localStorage si sale bien
const enviarYGuardar = async (ruta, datos, mensajeError) => {
  let response;
  try {
    response = await fetch(`${AUTH_URL}/${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Probá de nuevo en unos minutos.');
  }

  if (!response.ok) {
    throw new Error(mensajeError);
  }

  const data = await response.json();
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const loginUser = (email, password) =>
  enviarYGuardar('login', { email, password }, 'Correo o contraseña incorrectos');

export const registerUser = (nombre, email, password) =>
  enviarYGuardar('registro', { nombre, email, password }, 'El correo electrónico ya está registrado');

export const logoutUser = () => {
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};
