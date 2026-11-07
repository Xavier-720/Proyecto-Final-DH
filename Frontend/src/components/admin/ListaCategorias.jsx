import { useState } from 'react';
import Modal from '../Modal';
import useDatos from '../../hooks/useDatos';
import useAvisos from '../../hooks/useAvisos';
import { crearCategoria, eliminarCategoria } from '../../services/categoriaService';
import './Admin.css';

// US#21 y US#29: agregar y eliminar categorias
function ListaCategorias() {
  const { categorias, agregarCategoria, quitarCategoria } = useDatos();
  const { mostrarToast, confirmar } = useAvisos();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');

  const abrirModal = () => {
    setTitulo('');
    setDescripcion('');
    setImagen('');
    setError('');
    setMostrarModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const nueva = await crearCategoria({ titulo: titulo.trim(), descripcion: descripcion.trim(), imagen: imagen.trim() });
      agregarCategoria(nueva);
      setMostrarModal(false);
      mostrarToast('Categoría creada correctamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (categoria) => {
    const acepto = await confirmar({
      titulo: '¿Eliminar la categoría?',
      mensaje: `Vas a eliminar la categoría "${categoria.titulo}". Si hay hoteles asignados a ella no se va a poder eliminar.`,
      textoConfirmar: 'Eliminar',
    });
    if (!acepto) return;

    try {
      await eliminarCategoria(categoria.id);
      quitarCategoria(categoria.id);
      mostrarToast('Categoría eliminada correctamente.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  return (
    <div className="products-table-container">
      <div className="tabla-titulo">
        <h3>Gestión de Categorías</h3>
        <button className="action-btn" onClick={abrirModal}>+ Agregar categoría</button>
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
                <button className="delete-btn" onClick={() => eliminar(cat)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <Modal titulo="Agregar Categoría" onClose={() => setMostrarModal(false)}>
          {error && <p className="modal-error">⚠️ {error}</p>}
          <form onSubmit={guardar} className="admin-form">
            <div className="form-group">
              <label>Título:</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={100} required />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={500} required />
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
        </Modal>
      )}
    </div>
  );
}

export default ListaCategorias;
