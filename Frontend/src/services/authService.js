import { request, guardarToken, borrarToken, getToken } from './api';

const USER_KEY = 'user';

// guarda el token y los datos del usuario (sin contraseña) y devuelve el usuario
const guardarSesion = (data) => {
  const { token, ...usuario } = data;
  guardarToken(token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  return usuario;
};

export const loginUser = async (email, password) =>
  guardarSesion(await request('/auth/login', { method: 'POST', body: { email, password } }));

export const registerUser = async (nombre, email, password) =>
  guardarSesion(await request('/auth/registro', { method: 'POST', body: { nombre, email, password } }));

export const logoutUser = () => {
  borrarToken();
  localStorage.removeItem(USER_KEY);
};

// Lee el usuario guardado. Solo se usa para mostrar cosas en pantalla (nombre, botón de admin);
// los permisos reales los controla el backend con el token.
export const getStoredUser = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem(USER_KEY));
    const datosCompletos = usuario
      && typeof usuario.id === 'number'
      && typeof usuario.nombre === 'string'
      && typeof usuario.email === 'string'
      && ['USER', 'ADMIN'].includes(usuario.rol);

    // si falta algo (o no hay token) se descarta la sesión guardada en vez de romper la pantalla
    if (!datosCompletos || !getToken()) {
      logoutUser();
      return null;
    }
    return usuario;
  } catch {
    logoutUser();
    return null;
  }
};
