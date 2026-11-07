import { useState } from 'react';
import Modal from './Modal';
import useAuth from '../hooks/useAuth';
import useAvisos from '../hooks/useAvisos';

function RegisterModal() {
  const { registrar, cerrarRegistro } = useAuth();
  const { mostrarToast } = useAvisos();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // el backend guarda nombre y apellido juntos
      const nombreCompleto = `${nombre} ${apellido}`.trim();
      await registrar(nombreCompleto, email.trim(), password);

      mostrarToast('¡Registro exitoso! Revisá tu correo, te llegará un mensaje de bienvenida.');
      cerrarRegistro();
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
      setLoading(false);
    }
  };

  return (
    <Modal titulo="Crear Cuenta en Anteiku" onClose={cerrarRegistro}>
      {error && <p className="modal-error">⚠️ {error}</p>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={50} required />
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} maxLength={50} required />
        </div>

        <div className="form-group">
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej: nombre@correo.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña (mín. 6 caracteres):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <div className="modal-buttons">
          <button type="button" className="btn-cancel" onClick={cerrarRegistro} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RegisterModal;
