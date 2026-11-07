import { useState, useEffect } from 'react';
import { FavoritosContext } from './contexts';
import useAuth from '../hooks/useAuth';
import useAvisos from '../hooks/useAvisos';
import { listarFavoritos, agregarFavorito, quitarFavorito } from '../services/favoritoService';

// Favoritos del usuario logueado. Se guardan en el servidor (no en el navegador),
// así se ven igual desde cualquier dispositivo.
function FavoritosProvider({ children }) {
  const { usuario, abrirLogin } = useAuth();
  const { mostrarToast } = useAvisos();
  const [favoritos, setFavoritos] = useState([]); // ids de hoteles

  // cuando cambia el usuario se cargan sus favoritos (o se vacía la lista al cerrar sesión)
  useEffect(() => {
    if (!usuario) {
      setFavoritos([]);
      return;
    }

    let vigente = true;
    listarFavoritos()
      .then((ids) => { if (vigente) setFavoritos(ids); })
      .catch((err) => console.error('Error al cargar favoritos:', err));

    return () => { vigente = false; };
  }, [usuario]);

  // US#24: favoritos solo si está logueado
  const alternarFavorito = async (hotelId) => {
    if (!usuario) {
      mostrarToast('Iniciá sesión para guardar tus alojamientos favoritos.', 'info');
      abrirLogin();
      return;
    }

    const eraFavorito = favoritos.includes(hotelId);

    // primero se actualiza la pantalla y, si el servidor falla, se vuelve atrás
    setFavoritos((prev) => (eraFavorito ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]));

    try {
      if (eraFavorito) await quitarFavorito(hotelId);
      else await agregarFavorito(hotelId);
    } catch (err) {
      setFavoritos((prev) => (eraFavorito ? [...prev, hotelId] : prev.filter((id) => id !== hotelId)));
      mostrarToast(err.message, 'error');
    }
  };

  const valor = { favoritos, alternarFavorito };

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export default FavoritosProvider;
