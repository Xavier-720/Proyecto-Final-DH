import { useContext } from 'react';
import { AuthContext } from '../context/contexts';

function useAuth() {
  const valor = useContext(AuthContext);
  if (!valor) throw new Error('useAuth se tiene que usar dentro de AuthProvider');
  return valor;
}

export default useAuth;
