import { useState } from 'react';
import Modal from './Modal';
import useDatos from '../hooks/useDatos';
import useAvisos from '../hooks/useAvisos';
import { crearHotel, actualizarHotel } from '../services/hotelService';
import './AdminHotelModal.css';

// modal para crear o editar un hotel. Las categorías y características salen del contexto de datos.
// Se monta solo cuando está abierto, así el formulario arranca limpio cada vez.
function AdminHotelModal({ onClose, hotelAEditar }) {
  const { categorias, caracteristicas, agregarHotel, reemplazarHotel } = useDatos();
  const { mostrarToast } = useAvisos();

  const [nombre, setNombre] = useState(hotelAEditar?.nombre || '');
  const [ciudad, setCiudad] = useState(hotelAEditar?.ciudad || '');
  const [categoriaId, setCategoriaId] = useState(hotelAEditar?.categoria?.id ?? '');
  const [imagen, setImagen] = useState(hotelAEditar?.imagen || '');
  const [telefono, setTelefono] = useState(hotelAEditar?.telefono || '');
  const [descripcion, setDescripcion] = useState(hotelAEditar?.descripcion || '');
  const [idsSeleccionados, setIdsSeleccionados] = useState(
    (hotelAEditar?.caracteristicas || []).map((c) => c.id)
  );
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const esEdicion = !!hotelAEditar;

  const alternarCaracteristica = (id) => {
    setIdsSeleccionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    // al backend le mandamos solo los ids de la categoría y las características
    const hotelData = {
      nombre: nombre.trim(),
      ciudad: ciudad.trim(),
      categoriaId: Number(categoriaId),
      imagen: imagen.trim(),
      telefono: telefono.trim(),
      descripcion: descripcion.trim(),
      caracteristicaIds: idsSeleccionados,
    };

    try {
      if (esEdicion) {
        reemplazarHotel(await actualizarHotel(hotelAEditar.id, hotelData));
        mostrarToast('Hotel actualizado correctamente.');
      } else {
        agregarHotel(await crearHotel(hotelData));
        mostrarToast('Hotel creado correctamente.');
      }
      onClose();
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  };

  return (
    <Modal titulo={esEdicion ? 'Editar Producto' : 'Registrar Nuevo Hotel'} onClose={onClose}>
      {error && <p className="modal-error">⚠️ {error}</p>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={150} required />
        </div>

        <div className="form-group">
          <label>Ciudad:</label>
          <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} maxLength={100} required />
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="select-category"
            required
          >
            <option value="" disabled>Elegí una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.titulo}</option>
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
          <label>Teléfono de WhatsApp (opcional):</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Solo números con código de país. Ej: 5491123456789"
            pattern="\d{8,15}|"
            title="Entre 8 y 15 números, sin espacios ni símbolos"
          />
        </div>

        <div className="form-group">
          <label>Características:</label>
          <div className="caracteristicas-checkboxes">
            {caracteristicas.map((c) => (
              <label key={c.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={idsSeleccionados.includes(c.id)}
                  onChange={() => alternarCaracteristica(c.id)}
                />
                {c.icono} {c.nombre}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={1000} required />
        </div>

        <div className="modal-buttons">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={guardando}>Cancelar</button>
          <button type="submit" className="btn-submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AdminHotelModal;
