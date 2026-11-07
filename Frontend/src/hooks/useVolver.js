import { useNavigate } from 'react-router-dom';

// Vuelve a la pantalla anterior. Si el usuario entró directo por un link
// (no hay historial dentro de la app) lo manda a la ruta por defecto.
function useVolver(rutaPorDefecto = '/') {
  const navigate = useNavigate();

  return () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(rutaPorDefecto);
    }
  };
}

export default useVolver;
