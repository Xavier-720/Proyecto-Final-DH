import { useState, useRef, useCallback } from 'react';
import { AvisosContext } from './contexts';
import Modal from '../components/Modal';
import '../components/Toast.css';

// Mensajes para el usuario en un solo lugar:
//  - mostrarToast(mensaje, tipo): aviso que desaparece solo ('exito' | 'error' | 'info')
//  - confirmar({ titulo, mensaje }): modal de confirmación, devuelve una promesa con true o false
// Reemplaza a los alert() y window.confirm() sueltos.
function AvisosProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmacion, setConfirmacion] = useState(null);
  const contador = useRef(0);

  const mostrarToast = useCallback((mensaje, tipo = 'exito') => {
    const id = ++contador.current;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const confirmar = useCallback(
    (opciones) => new Promise((resolver) => setConfirmacion({ ...opciones, resolver })),
    []
  );

  const responder = (respuesta) => {
    confirmacion.resolver(respuesta);
    setConfirmacion(null);
  };

  const valor = { mostrarToast, confirmar };

  return (
    <AvisosContext.Provider value={valor}>
      {children}

      <div className="toast-contenedor" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tipo}`} role={t.tipo === 'error' ? 'alert' : 'status'}>
            {t.mensaje}
          </div>
        ))}
      </div>

      {confirmacion && (
        <Modal titulo={confirmacion.titulo || '¿Estás seguro?'} onClose={() => responder(false)}>
          <p className="texto-confirmar">{confirmacion.mensaje}</p>
          <div className="modal-buttons centrado">
            <button type="button" className="btn-cancel" onClick={() => responder(false)}>Cancelar</button>
            <button type="button" className="delete-btn" onClick={() => responder(true)}>
              {confirmacion.textoConfirmar || 'Confirmar'}
            </button>
          </div>
        </Modal>
      )}
    </AvisosContext.Provider>
  );
}

export default AvisosProvider;
