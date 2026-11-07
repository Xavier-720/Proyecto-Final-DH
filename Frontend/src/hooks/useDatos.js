import { useContext } from 'react';
import { DatosContext } from '../context/contexts';

function useDatos() {
  const valor = useContext(DatosContext);
  if (!valor) throw new Error('useDatos se tiene que usar dentro de DatosProvider');
  return valor;
}

export default useDatos;
