import { useContext } from 'react';
import { TemaContext } from '../context/contexts';

function useTema() {
  const valor = useContext(TemaContext);
  if (!valor) throw new Error('useTema se tiene que usar dentro de TemaProvider');
  return valor;
}

export default useTema;
