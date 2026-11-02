import { useState } from 'react';
import ListaProductos from './ListaProductos';
import ListaCategorias from './ListaCategorias';
import ListaCaracteristicas from './ListaCaracteristicas';
import ListaUsuarios from './ListaUsuarios';
import './AdminPanel.css';

// panel de administracion (US#9): un menu y debajo cada seccion
function AdminPanel({ hoteles, onOpenModal, onEditHotel, onDeleteHotel, onBack, darkMode }) {
  // menu | productos | categorias | caracteristicas | usuarios
  const [seccion, setSeccion] = useState('menu');

  return (
    <div className="admin-view">
      {/* en celular no se puede usar el panel, el css muestra este aviso en vez del panel */}
      <div className="mobile-warning">
        <h2>⚠️ Acceso no disponible</h2>
        <p>El panel de administración solo está disponible en computadoras de escritorio.</p>
        <button className="back-btn-mobile" onClick={onBack}>Volver al inicio</button>
      </div>

      <div className={`desktop-admin ${darkMode ? 'dark-card' : 'light-card'}`}>
        <div className="admin-header-bar">
          <h2>Panel de Administración</h2>
          <button className="back-btn-clean" onClick={seccion === 'menu' ? onBack : () => setSeccion('menu')}>
            ← {seccion === 'menu' ? 'Volver' : 'Volver al Menú'}
          </button>
        </div>

        {seccion === 'menu' && (
          <div className="admin-menu">
            <div className="menu-card" onClick={onOpenModal}>
              <span className="menu-icon">➕</span>
              <h3>Agregar Producto</h3>
              <p>Registrar un nuevo hotel o alojamiento en la base de datos.</p>
            </div>
            <div className="menu-card" onClick={() => setSeccion('productos')}>
              <span className="menu-icon">📋</span>
              <h3>Lista de productos</h3>
              <p>Visualizar y gestionar todos los productos cargados.</p>
            </div>
            <div className="menu-card" onClick={() => setSeccion('categorias')}>
              <span className="menu-icon">🏷️</span>
              <h3>Agregar categoría</h3>
              <p>Crear nuevas categorías con título, descripción e imagen.</p>
            </div>
            <div className="menu-card" onClick={() => setSeccion('caracteristicas')}>
              <span className="menu-icon">⚡</span>
              <h3>Administrar características</h3>
              <p>Añadir, editar o eliminar comodidades e íconos.</p>
            </div>
            <div className="menu-card" onClick={() => setSeccion('usuarios')}>
              <span className="menu-icon">👥</span>
              <h3>Gestión de Usuarios</h3>
              <p>Asignar o quitar permisos de administrador.</p>
            </div>
          </div>
        )}

        {seccion === 'productos' && (
          <ListaProductos hoteles={hoteles} onEditHotel={onEditHotel} onDeleteHotel={onDeleteHotel} />
        )}
        {seccion === 'categorias' && <ListaCategorias darkMode={darkMode} />}
        {seccion === 'caracteristicas' && <ListaCaracteristicas darkMode={darkMode} />}
        {seccion === 'usuarios' && <ListaUsuarios />}
      </div>
    </div>
  );
}

export default AdminPanel;
