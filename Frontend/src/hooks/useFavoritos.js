import { useState, useEffect } from 'react';

// los favoritos se guardan en el navegador, uno por usuario
const clave = (usuario) => `anteiku_favs_${usuario.id || usuario.email}`;

const leer = (usuario) => {
  try {
    return JSON.parse(localStorage.getItem(clave(usuario))) || [];
  } catch {
    return [];
  }
};

function useFavoritos(usuario) {
  const [favoritos, setFavoritos] = useState(() => (usuario ? leer(usuario) : []));

  // cuando cambia el usuario se cargan sus favoritos
  useEffect(() => {
    setFavoritos(usuario ? leer(usuario) : []);
  }, [usuario]);

  // y cada cambio se guarda
  useEffect(() => {
    if (usuario) localStorage.setItem(clave(usuario), JSON.stringify(favoritos));
  }, [favoritos, usuario]);

  const alternarFavorito = (id) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return [favoritos, alternarFavorito];
}

export default useFavoritos;
