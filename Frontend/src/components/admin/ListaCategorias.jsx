import { useState, useEffect } from 'react';
import '../Modal.css';

import { API_URL } from '../../services/api';

// US#21 y US#29: agregar y eliminar categorias
function ListaCategorias({ darkMode }) {
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [aEliminar, setAEliminar] = useState(null); // categoria que espera confirmacion

  useEffect(() => {
    fetch(`${API_URL}/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error('Error al cargar categorías:', err));
  }, []);

  const guardar = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descripcion, imagen }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('error al guardar');
        return res.json();
      })
      .then((data) => {
        setCategorias((prev) => [...prev, data]);
        setMostrarModal(false);
        setTitulo('');
        setDescripcion('');
        setImagen('');
      })
      .catch(() => alert('No se pudo guardar la categoría. Puede que el título ya exista.'));
  };

  const confirmarEliminar = () => {
    fetch(`${API_URL}/categorias/${aEliminar.id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('error al eliminar');
        setCategorias((prev) => prev.filter((c) => c.id !== aEliminar.id));
        setAEliminar(null);
      })
      .catch(() => alert('No se pudo eliminar la categoría.'));
  };

  return (
    <div className="products-table-container">
      <div className="tabla-titulo">
        <h3>Gestión de Categorías</h3>
        <button className="action-btn" onClick={() => setMostrarModal(true)}>+ Agregar categoría</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Imagen</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td><img className="mini-img" src={cat.imagen} alt={cat.titulo} /></td>
              <td>{cat.titulo}</td>
              <td>{cat.descripcion}</td>
              <td className="table-actions">
                <button className="delete-btn" onClick={() => setAEliminar(cat)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
            <h3>Agregar Categoría</h3>
            <form onSubmit={guardar} className="admin-form">
              <div className="form-group">
                <label>Título:</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>URL Imagen:</label>
                <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="https://..." required />
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {aEliminar && (
        <div className="modal-overlay">
          <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
            <h3>¿Estás seguro de eliminar la categoría?</h3>
            <p className="texto-confirmar">
              Estás a punto de eliminar la categoría <strong>"{aEliminar.titulo}"</strong>.
              Esta acción puede afectar a los productos asociados a la misma.
            </p>
            <div className="modal-buttons centrado">
              <button type="button" className="btn-cancel" onClick={() => setAEliminar(null)}>Cancelar</button>
              <button type="button" className="delete-btn" onClick={confirmarEliminar}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaCategorias;
