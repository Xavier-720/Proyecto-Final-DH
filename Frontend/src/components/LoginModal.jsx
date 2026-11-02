import { useState } from 'react';
import { loginUser } from '../services/authService';
import './Modal.css';

// mensajeObligatorio: se muestra el aviso cuando quiere reservar sin estar logueado (US#30)
function LoginModal({ isOpen, onClose, onLoginSuccess, darkMode, mensajeObligatorio }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      onLoginSuccess(data);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
        <h3>Iniciar Sesión en Anteiku</h3>

        {mensajeObligatorio && (
          <p className="modal-aviso">
            Para reservar tenés que iniciar sesión. Si todavía no tenés cuenta,
            cerrá esta ventana y creala desde "Crear cuenta".
          </p>
        )}

        {error && <p className="modal-error">⚠️ {error}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej: admin@anteiku.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
