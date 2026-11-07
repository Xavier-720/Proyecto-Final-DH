import { useState, useEffect } from 'react';
import { AuthContext } from './contexts';
import useAvisos from '../hooks/useAvisos';
import { getStoredUser, loginUser, registerUser, logoutUser } from '../services/authService';

// Sesión del usuario y estado de los modales de login y registro,
// para poder abrirlos desde cualquier pantalla.
function AuthProvider({ children }) {
  const { mostrarToast } = useAvisos();

  const [usuario, setUsuario] = useState(getStoredUser);
  const [loginAbierto, setLoginAbierto] = useState(false);
  const [loginObligatorio, setLoginObligatorio] = useState(false);
  const [registroAbierto, setRegistroAbierto] = useState(false);

  // si el backend responde 401 con un token guardado, la sesión venció
  useEffect(() => {
    const alExpirar = () => {
      logoutUser();
      setUsuario(null);
      mostrarToast('Tu sesión expiró. Iniciá sesión nuevamente.', 'info');
    };
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, [mostrarToast]);

  const login = async (email, password) => {
    const datos = await loginUser(email, password);
    setUsuario(datos);
    return datos;
  };

  const registrar = async (nombre, email, password) => {
    const datos = await registerUser(nombre, email, password);
    setUsuario(datos);
    return datos;
  };

  const logout = () => {
    logoutUser();
    setUsuario(null);
  };

  // obligatorio = true cuando intenta reservar sin estar logueado (US#30)
  const abrirLogin = (obligatorio = false) => {
    setLoginObligatorio(obligatorio);
    setLoginAbierto(true);
  };

  const cerrarLogin = () => {
    setLoginAbierto(false);
    setLoginObligatorio(false);
  };

  const abrirRegistro = () => setRegistroAbierto(true);
  const cerrarRegistro = () => setRegistroAbierto(false);

  const valor = {
    usuario,
    esAdmin: usuario?.rol === 'ADMIN',
    login,
    registrar,
    logout,
    loginAbierto,
    loginObligatorio,
    abrirLogin,
    cerrarLogin,
    registroAbierto,
    abrirRegistro,
    cerrarRegistro,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
