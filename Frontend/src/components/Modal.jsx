import { useEffect } from 'react';
import './Modal.css';

// Ventana modal base: se cierra con Escape y haciendo clic fuera del cuadro.
// La usan el login, el registro, los formularios del admin, las confirmaciones, etc.
function Modal({ titulo, onClose, children, claseContenido = '' }) {
  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [onClose]);

  return (
    // mousedown y no click, así no se cierra si el usuario selecciona texto y suelta el mouse afuera
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-content tema-card ${claseContenido}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        {titulo && <h3>{titulo}</h3>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
