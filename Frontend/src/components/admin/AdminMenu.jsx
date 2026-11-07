import { Link, useOutletContext } from 'react-router-dom';
import './Admin.css';

// menú principal del panel (US#9)
function AdminMenu() {
  const { abrirModalHotel } = useOutletContext();

  return (
    <div className="admin-menu">
      <div className="menu-card" onClick={() => abrirModalHotel(null)}>
        <span className="menu-icon">➕</span>
        <h3>Agregar Producto</h3>
        <p>Registrar un nuevo hotel o alojamiento en la base de datos.</p>
      </div>
      <Link className="menu-card" to="/admin/productos">
        <span className="menu-icon">📋</span>
        <h3>Lista de productos</h3>
        <p>Visualizar y gestionar todos los productos cargados.</p>
      </Link>
      <Link className="menu-card" to="/admin/categorias">
        <span className="menu-icon">🏷️</span>
        <h3>Agregar categoría</h3>
        <p>Crear nuevas categorías con título, descripción e imagen.</p>
      </Link>
      <Link className="menu-card" to="/admin/caracteristicas">
        <span className="menu-icon">⚡</span>
        <h3>Administrar características</h3>
        <p>Añadir, editar o eliminar comodidades e íconos.</p>
      </Link>
      <Link className="menu-card" to="/admin/usuarios">
        <span className="menu-icon">👥</span>
        <h3>Gestión de Usuarios</h3>
        <p>Asignar o quitar permisos de administrador.</p>
      </Link>
    </div>
  );
}

export default AdminMenu;
