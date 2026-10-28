import { useState } from 'react';
import './AdminHotelModal.css';

function AdminHotelModal({ isOpen, onClose, onHotelCreated, darkMode }) {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // envia form al back
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const nuevoHotel = { nombre, ciudad, descripcion };

    fetch('http://localhost:8080/api/hoteles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoHotel),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => { throw new Error(text || 'el nombre ya esta en uso'); });
        }
        return res.json();
      })
      .then((data) => {
        onHotelCreated(data);
        onClose();
        setNombre('');
        setCiudad('');
        setDescripcion('');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
        <h3>Registrar Nuevo Hotel</h3>
        
        {error && <p className="modal-error">⚠️ {error}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Ciudad:</label>
            <input 
              type="text" 
              value={ciudad} 
              onChange={(e) => setCiudad(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              required 
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminHotelModal;