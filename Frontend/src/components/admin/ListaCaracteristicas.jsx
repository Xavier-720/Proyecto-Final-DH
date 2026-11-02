import { useState, useEffect } from 'react';
import '../Modal.css';

import { API_URL, leerError } from '../../services/api';

// US#17: añadir, editar y eliminar caracteristicas
function ListaCaracteristicas({ darkMode }) {
  const [features, setFeatures] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null); // null cuando es una nueva
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('📶');

  useEffect(() => {
    fetch(`${API_URL}/caracteristicas`)
      .then((res) => res.json())
      .then((data) => setFeatures(data))
      .catch((err) => console.error('Error al cargar características:', err));
  }, []);

  const abrirModal = (feature) => {
    setEditando(feature);
    setNombre(feature ? feature.nombre : '');
    setIcono(feature ? feature.icono : '📶');
    setMostrarModal(true);
  };

  const guardar = (e) => {
    e.preventDefault();
    const url = editando ? `${API_URL}/caracteristicas/${editando.id}` : `${API_URL}/caracteristicas`;

    fetch(url, {
      method: editando ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, icono }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('error al guardar');
        return res.json();
      })
      .then((data) => {
        setFeatures((prev) => (editando ? prev.map((f) => (f.id === data.id ? data : f)) : [...prev, data]));
        setMostrarModal(false);
      })
      .catch(() => alert('No se pudo guardar la característica.'));
  };

  const eliminar = (id) => {
    fetch(`${API_URL}/caracteristicas/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await leerError(res, 'No se pudo eliminar la característica.'));
        setFeatures((prev) => prev.filter((f) => f.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="products-table-container">
      <div className="tabla-titulo">
        <h3>Administrar características</h3>
        <button className="action-btn" onClick={() => abrirModal(null)}>+ Añadir nueva</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Ícono</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.icono}</td>
              <td>{f.nombre}</td>
              <td className="table-actions">
                <button className="edit-btn" onClick={() => abrirModal(f)}>Editar</button>
                <button className="delete-btn" onClick={() => eliminar(f.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
            <h3>{editando ? 'Editar Característica' : 'Añadir Característica'}</h3>
            <form onSubmit={guardar} className="admin-form">
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Ícono (Emoji):</label>
                <input type="text" value={icono} onChange={(e) => setIcono(e.target.value)} maxLength={2} required />
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaCaracteristicas;
