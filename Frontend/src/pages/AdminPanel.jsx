import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AdminHotelModal from '../components/AdminHotelModal';
import '../components/admin/Admin.css';

// panel de administracion (US#9). Cada sección tiene su propia url (/admin/productos, etc.)
// y se dibuja en el <Outlet />. La ruta completa está protegida en App.jsx.
function AdminPanel() {
  const { pathname } = useLocation();
  const enElMenu = pathname === '/admin' || pathname === '/admin/';

  // el modal de hotel lo abren el menú (alta) y la lista de productos (edición)
  const [modalHotelAbierto, setModalHotelAbierto] = useState(false);
  const [hotelAEditar, setHotelAEditar] = useState(null);

  const abrirModalHotel = (hotel) => {
    setHotelAEditar(hotel);
    setModalHotelAbierto(true);
  };

  return (
    <div className="admin-view">
      {/* en celular no se puede usar el panel, el css muestra este aviso en vez del panel */}
      <div className="mobile-warning">
        <h2>⚠️ Acceso no disponible</h2>
        <p>El panel de administración solo está disponible en computadoras de escritorio.</p>
        <Link className="back-btn-mobile" to="/">Volver al inicio</Link>
      </div>

      <div className="desktop-admin tema-card">
        <div className="admin-header-bar">
          <h2>Panel de Administración</h2>
          <Link className="back-btn-clean" to={enElMenu ? '/' : '/admin'}>
            ← {enElMenu ? 'Volver' : 'Volver al Menú'}
          </Link>
        </div>

        <Outlet context={{ abrirModalHotel }} />
      </div>

      {modalHotelAbierto && (
        <AdminHotelModal hotelAEditar={hotelAEditar} onClose={() => setModalHotelAbierto(false)} />
      )}
    </div>
  );
}

export default AdminPanel;
