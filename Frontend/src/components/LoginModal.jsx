import { useState } from 'react';
import Modal from './Modal';
import useAuth from '../hooks/useAuth';
import useAvisos from '../hooks/useAvisos';

// Se muestra el aviso cuando quiere reservar sin estar logueado (US#30)
function LoginModal() {
  const { login, cerrarLogin, loginObligatorio } = useAuth();
  const { mostrarToast } = useAvisos();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuario = await login(email.trim(), password);
      mostrarToast(`¡Hola, ${usuario.nombre.split(' ')[0]}! Iniciaste sesión.`);
      cerrarLogin();
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus datos.');
      setLoading(false);
    }
  };

  return (
    <Modal titulo="Iniciar Sesión en Anteiku" onClose={cerrarLogin}>
      {loginObligatorio && (
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
            placeholder="ej: nombre@correo.com"
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
          <button type="button" className="btn-cancel" onClick={cerrarLogin} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default LoginModal;
