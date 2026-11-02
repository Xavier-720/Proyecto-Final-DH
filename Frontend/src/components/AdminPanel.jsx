import { useState, useEffect } from 'react';
import { API_URL, leerError } from '../services/api';
import './Modal.css';
import './AdminPanel.css';

function AdminPanel({ hoteles, onOpenModal, onEditHotel, onDeleteHotel, onBack, darkMode }) {
  // subVista: menu | tabla | categorias | caracteristicas | usuarios
  const [subVista, setSubVista] = useState('menu');
  const [usuarios, setUsuarios] = useState([]);
  const [features, setFeatures] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [nombreFeature, setNombreFeature] = useState('');
  const [iconoFeature, setIconoFeature] = useState('📶');

  const [showCatModal, setShowCatModal] = useState(false);
  const [nombreCat, setNombreCat] = useState('');
  const [descripcionCat, setDescripcionCat] = useState('');
  const [imagenCat, setImagenCat] = useState('');

  // categoría que está esperando confirmación para borrarse
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  // carga los datos según la pantalla en la que estemos
  useEffect(() => {
    if (subVista === 'caracteristicas') {
      fetch(`${API_URL}/caracteristicas`)
        .then((res) => res.json())
        .then((data) => setFeatures(data))
        .catch((err) => console.error('Error al cargar features:', err));
    } else if (subVista === 'categorias') {
      fetch(`${API_URL}/categorias`)
        .then((res) => res.json())
        .then((data) => setCategorias(data))
        .catch((err) => console.error('Error al cargar categorías:', err));
    } else if (subVista === 'usuarios') {
      fetch(`${API_URL}/auth/usuarios`)
        .then((res) => res.json())
        .then((data) => {
          // el backend guarda nombre y apellido juntos, acá los separamos para mostrarlos
          const usuariosFormateados = data.map((u) => {
            const partes = (u.nombre || '').split(' ');
            return {
              ...u,
              nombre: partes[0],
              apellido: partes.slice(1).join(' '),
              esAdmin: u.rol === 'ADMIN',
            };
          });
          setUsuarios(usuariosFormateados);
        })
        .catch((err) => console.error('Error al cargar usuarios:', err));
    }
  }, [subVista]);

  const toggleAdmin = (usuario) => {
    const nuevoRol = usuario.esAdmin ? 'USER' : 'ADMIN';

    fetch(`${API_URL}/auth/usuarios/${usuario.id}/rol`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol: nuevoRol }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al actualizar el rol');
        return res.json();
      })
      .then((data) => {
        setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? { ...u, rol: data.rol, esAdmin: data.rol === 'ADMIN' } : u)));
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('No se pudo actualizar el rol del usuario en el servidor.');
      });
  };

  const handleSaveFeature = (e) => {
    e.preventDefault();
    const nueva = { nombre: nombreFeature, icono: iconoFeature };

    fetch(`${API_URL}/caracteristicas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva),
    })
      .then((res) => {
        if (!res.ok) throw new Error('error al guardar');
        return res.json();
      })
      .then((data) => {
        setFeatures((prev) => [...prev, data]);
        setShowFeatureModal(false);
        setNombreFeature('');
        setIconoFeature('📶');
      })
      .catch((err) => {
        console.error('Error al guardar feature:', err);
        alert('No se pudo guardar la característica en el servidor.');
      });
  };

  const handleDeleteFeature = (id) => {
    fetch(`${API_URL}/caracteristicas/${id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await leerError(res, 'No se pudo eliminar la característica.'));
        setFeatures((prev) => prev.filter((f) => f.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  const handleSaveCategoria = (e) => {
    e.preventDefault();
    const nuevaCat = { titulo: nombreCat, descripcion: descripcionCat, imagen: imagenCat };

    fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCat),
    })
      .then((res) => {
        if (!res.ok) throw new Error('error al guardar');
        return res.json();
      })
      .then((data) => {
        setCategorias((prev) => [...prev, data]);
        setShowCatModal(false);
        setNombreCat('');
        setDescripcionCat('');
        setImagenCat('');
      })
      .catch((err) => {
        console.error('Error al guardar categoría:', err);
        alert('No se pudo guardar la categoría. Puede que el título ya exista.');
      });
  };

  const confirmarEliminarCategoria = () => {
    if (!categoriaAEliminar) return;

    fetch(`${API_URL}/categorias/${categoriaAEliminar.id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('error al eliminar');
        setCategorias((prev) => prev.filter((c) => c.id !== categoriaAEliminar.id));
        setCategoriaAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar categoría:', err);
        alert('No se pudo eliminar la categoría.');
      });
  };

  // HU #11: pide confirmación, borra en el servidor y recién ahí lo saca de la lista
  const handleDeleteHotel = (hotel) => {
    if (!window.confirm(`¿Seguro que querés eliminar "${hotel.nombre}"?`)) return;

    fetch(`${API_URL}/hoteles/${hotel.id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await leerError(res, 'No se pudo eliminar el producto.'));
        onDeleteHotel(hotel.id);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="admin-view">
      {/* HU #9: en celular el panel no está disponible (el css oculta uno u otro) */}
      <div className="mobile-warning">
        <h2>⚠️ Acceso no disponible</h2>
        <p>El panel de administración solo está disponible en computadoras de escritorio.</p>
        <button className="back-btn-mobile" onClick={onBack}>Volver al inicio</button>
      </div>

      <div className={`desktop-admin ${darkMode ? 'dark-card' : 'light-card'}`}>
        <div className="admin-header-bar">
          <h2>Panel de Administración</h2>
          <button className="back-btn-clean" onClick={subVista !== 'menu' ? () => setSubVista('menu') : onBack}>
            ← {subVista !== 'menu' ? 'Volver al Menú' : 'Volver'}
          </button>
        </div>

        {subVista === 'menu' ? (
          <div className="admin-menu">
            <div className="menu-card" onClick={onOpenModal}>
              <span className="menu-icon">➕</span>
              <h3>Agregar Producto</h3>
              <p>Registrar un nuevo hotel o alojamiento en la base de datos.</p>
            </div>

            <div className="menu-card" onClick={() => setSubVista('tabla')}>
              <span className="menu-icon">📋</span>
              <h3>Lista de productos</h3>
              <p>Visualizar y gestionar todos los productos cargados.</p>
            </div>

            <div className="menu-card" onClick={() => setSubVista('categorias')}>
              <span className="menu-icon">🏷️</span>
              <h3>Agregar categoría</h3>
              <p>Crear nuevas categorías con título, descripción e imagen.</p>
            </div>

            <div className="menu-card" onClick={() => setSubVista('caracteristicas')}>
              <span className="menu-icon">⚡</span>
              <h3>Administrar características</h3>
              <p>Añadir o eliminar comodidades e íconos.</p>
            </div>

            <div className="menu-card" onClick={() => setSubVista('usuarios')}>
              <span className="menu-icon">👥</span>
              <h3>Gestión de Usuarios</h3>
              <p>Asignar o quitar permisos de administrador.</p>
            </div>
          </div>
        ) : subVista === 'tabla' ? (
          <div className="products-table-container">
            <h3>Lista de productos</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {hoteles.map((hotel) => (
                  <tr key={hotel.id}>
                    <td>{hotel.id}</td>
                    <td>{hotel.nombre}</td>
                    <td><span className="category-badge">{hotel.categoria || 'Sin Categoría'}</span></td>
                    <td className="table-actions">
                      <button className="edit-btn" onClick={() => onEditHotel(hotel)}>Editar</button>
                      <button className="delete-btn" onClick={() => handleDeleteHotel(hotel)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : subVista === 'categorias' ? (
          <div className="products-table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Gestión de Categorías</h3>
              <button className="action-btn" onClick={() => setShowCatModal(true)}>+ Agregar categoría</button>
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
                    <td><img src={cat.imagen} alt={cat.titulo} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                    <td>{cat.titulo}</td>
                    <td>{cat.descripcion}</td>
                    <td className="table-actions">
                      <button className="delete-btn" onClick={() => setCategoriaAEliminar(cat)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : subVista === 'caracteristicas' ? (
          <div className="products-table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Administrar características</h3>
              <button className="action-btn" onClick={() => setShowFeatureModal(true)}>+ Añadir nueva</button>
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
                    <td><button className="delete-btn" onClick={() => handleDeleteFeature(f.id)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="products-table-container">
            <h3>Gestión de Usuarios</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre} {u.apellido}</td>
                    <td>{u.email}</td>
                    <td><span className={`category-badge ${u.esAdmin ? 'admin-badge' : ''}`}>{u.esAdmin ? 'Admin' : 'Usuario'}</span></td>
                    <td><button className={u.esAdmin ? 'delete-btn' : 'action-btn'} onClick={() => toggleAdmin(u)}>{u.esAdmin ? 'Quitar Admin' : 'Hacer Admin'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCatModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
            <h3>Agregar Categoría</h3>
            <form onSubmit={handleSaveCategoria} className="admin-form">
              <div className="form-group">
                <label>Título:</label>
                <input type="text" value={nombreCat} onChange={(e) => setNombreCat(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Descripción:</label>
                <textarea value={descripcionCat} onChange={(e) => setDescripcionCat(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>URL Imagen:</label>
                <input type="text" value={imagenCat} onChange={(e) => setImagenCat(e.target.value)} placeholder="https://..." required />
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowCatModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFeatureModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
            <h3>Añadir Característica</h3>
            <form onSubmit={handleSaveFeature} className="admin-form">
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={nombreFeature} onChange={(e) => setNombreFeature(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Ícono (Emoji):</label>
                <input type="text" value={iconoFeature} onChange={(e) => setIconoFeature(e.target.value)} maxLength={2} required />
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-cancel" onClick={() => setShowFeatureModal(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HU #29: confirmación antes de borrar una categoría */}
      {categoriaAEliminar && (
        <div className="modal-overlay">
          <div className={`modal-content ${darkMode ? 'dark-card' : 'light-card'}`}>
            <h3>¿Estás seguro de eliminar la categoría?</h3>
            <p style={{ margin: '1rem 0', fontSize: '0.95rem', lineHeight: '1.4' }}>
              Estás a punto de eliminar la categoría <strong>"{categoriaAEliminar.titulo}"</strong>.
              Esta acción puede afectar a los productos asociados a la misma.
            </p>
            <div className="modal-buttons" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setCategoriaAEliminar(null)} className="btn-cancel">
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminarCategoria}
                className="delete-btn"
                style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
