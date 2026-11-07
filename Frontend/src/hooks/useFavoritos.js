import { useContext } from 'react';
import { FavoritosContext } from '../context/contexts';

function useFavoritos() {
  const valor = useContext(FavoritosContext);
  if (!valor) throw new Error('useFavoritos se tiene que usar dentro de FavoritosProvider');
  return valor;
}

export default useFavoritos;
