import { useState } from 'react';
import Modal from '../Modal';
import useDatos from '../../hooks/useDatos';
import useAvisos from '../../hooks/useAvisos';
import {
  crearCaracteristica,
  editarCaracteristica,
  eliminarCaracteristica,
} from '../../services/caracteristicaService';
import './Admin.css';

// US#17: añadir, editar y eliminar caracteristicas
function ListaCaracteristicas() {
  const {
    caracteristicas, agregarCaracteristica, reemplazarCaracteristica, quitarCaracteristica, recargarHoteles,
  } = useDatos();
  const { mostrarToast, confirmar } = useAvisos();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null); // null cuando es una nueva
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('📶');
  const [error, setError] = useState('');

  const abrirModal = (feature) => {
    setEditando(feature);
    setNombre(feature ? feature.nombre : '');
    setIcono(feature ? feature.icono : '📶');
    setError('');
    setMostrarModal(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');

    const datos = { nombre: nombre.trim(), icono: icono.trim() };

    try {
      if (editando) {
        reemplazarCaracteristica(await editarCaracteristica(editando.id, datos));
        // los hoteles muestran el nombre y el ícono, así que también se vuelven a pedir
        recargarHoteles();
        mostrarToast('Característica actualizada correctamente.');
      } else {
        agregarCaracteristica(await crearCaracteristica(datos));
        mostrarToast('Característica creada correctamente.');
      }
      setMostrarModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (feature) => {
    const acepto = await confirmar({
      titulo: '¿Eliminar la característica?',
      mensaje: `Vas a eliminar "${feature.nombre}". Si algún hotel la tiene asignada no se va a poder eliminar.`,
      textoConfirmar: 'Eliminar',
    });
    if (!acepto) return;

    try {
      await eliminarCaracteristica(feature.id);
      quitarCaracteristica(feature.id);
      mostrarToast('Característica eliminada correctamente.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
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
          {caracteristicas.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.icono}</td>
              <td>{f.nombre}</td>
              <td className="table-actions">
                <button className="edit-btn" onClick={() => abrirModal(f)}>Editar</button>
                <button className="delete-btn" onClick={() => eliminar(f)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <Modal
          titulo={editando ? 'Editar Característica' : 'Añadir Característica'}
          onClose={() => setMostrarModal(false)}
        >
          {error && <p className="modal-error">⚠️ {error}</p>}
          <form onSubmit={guardar} className="admin-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} required />
            </div>
            <div className="form-group">
              <label>Ícono (Emoji):</label>
              <input type="text" value={icono} onChange={(e) => setIcono(e.target.value)} maxLength={10} required />
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

export default ListaCaracteristicas;
