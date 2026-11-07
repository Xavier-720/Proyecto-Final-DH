import { useContext } from 'react';
import { AvisosContext } from '../context/contexts';

function useAvisos() {
  const valor = useContext(AvisosContext);
  if (!valor) throw new Error('useAvisos se tiene que usar dentro de AvisosProvider');
  return valor;
}

export default useAvisos;
