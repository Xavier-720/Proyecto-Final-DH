import { useState, useEffect } from 'react';
import { API_URL, leerError } from '../services/api';
import './Modal.css';
import './AdminHotelModal.css';

// modal para crear o editar un hotel
function AdminHotelModal({ isOpen, onClose, onHotelCreated, onHotelUpdated, hotelAEditar, darkMode }) {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [caracteristicasDisponibles, setCaracteristicasDisponibles] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);
  const [error, setError] = useState('');

  // cada vez que se abre trae las categorias y caracteristicas
  useEffect(() => {
    if (!isOpen) return;

    fetch(`${API_URL}/categorias`)
      .then((res) => res.json())
      .then((data) => setCategoriasDisponibles(data))
      .catch((err) => console.error('Error al cargar categorías:', err));

    fetch(`${API_URL}/caracteristicas`)
      .then((res) => res.json())
      .then((data) => setCaracteristicasDisponibles(data))
      .catch((err) => console.error('Error al cargar características:', err));
  }, [isOpen]);

  // si estamos editando carga los datos del hotel, si no deja el form vacio
  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setNombre(hotelAEditar?.nombre || '');
    setCiudad(hotelAEditar?.ciudad || '');
    setCategoria(hotelAEditar?.categoria || '');
    setImagen(hotelAEditar?.imagen || '');
    setDescripcion(hotelAEditar?.descripcion || '');
    setCaracteristicasSeleccionadas(hotelAEditar?.caracteristicas || []);
  }, [hotelAEditar, isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (carac) => {
    setCaracteristicasSeleccionadas((prev) =>
      prev.some((c) => c.id === carac.id)
        ? prev.filter((c) => c.id !== carac.id)
        : [...prev, carac]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const hotelData = {
      nombre: nombre.trim(),
      ciudad,
      categoria,
      imagen: imagen.trim(),
      descripcion,
      caracteristicas: caracteristicasSeleccionadas,
    };

    const esEdicion = !!hotelAEditar;
    const url = esEdicion ? `${API_URL}/hoteles/${hotelAEditar.id}` : `${API_URL}/hoteles`;

    fetch(url, {
      method: esEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotelData),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await leerError(res, 'No se pudo guardar el hotel.'));
        return res.json();
      })
      .then((data) => {
        if (esEdicion) {
          onHotelUpdated(data);
        } else {
          onHotelCreated(data);
        }
        onClose();
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
        <h3>{hotelAEditar ? 'Editar Producto' : 'Registrar Nuevo Hotel'}</h3>

        {error && <p className="modal-error">⚠️ {error}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Ciudad:</label>
            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="select-category"
              required
            >
              <option value="" disabled>Elegí una categoría</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat.id} value={cat.titulo}>{cat.titulo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>URL de la imagen:</label>
            <input
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Características:</label>
            <div className="caracteristicas-checkboxes">
              {caracteristicasDisponibles.map((c) => (
                <label key={c.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={caracteristicasSeleccionadas.some((item) => item.id === c.id)}
                    onChange={() => handleCheckboxChange(c)}
                  />
                  {c.icono} {c.nombre}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
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
