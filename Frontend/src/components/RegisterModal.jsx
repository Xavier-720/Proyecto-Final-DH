import { useState } from 'react';
import { registerUser } from '../services/authService';
import './Modal.css';
import './RegisterModal.css';

function RegisterModal({ isOpen, onClose, onRegisterSuccess, darkMode }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // el backend guarda nombre y apellido juntos
      const nombreCompleto = `${nombre} ${apellido}`.trim();
      const data = await registerUser(nombreCompleto, email, password);

      setExito(true);

      if (onRegisterSuccess) {
        onRegisterSuccess(data);
      }

      // se ve el mensaje 2 segundos y se cierra
      setTimeout(() => {
        setExito(false);
        onClose();
        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
        <h3>Crear Cuenta en Anteiku</h3>

        {error && <p className="modal-error">⚠️ {error}</p>}
        {exito && <p className="modal-success">¡Registro exitoso! Revisá tu correo, te llegará un mensaje de bienvenida.</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Apellido:</label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: admin@anteiku.com (para rol admin)"
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
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
