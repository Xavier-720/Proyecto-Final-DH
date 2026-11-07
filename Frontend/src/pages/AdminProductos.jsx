import { useOutletContext } from 'react-router-dom';
import ListaProductos from '../components/admin/ListaProductos';

// la lista necesita abrir el modal de edición que vive en AdminPanel
function AdminProductos() {
  const { abrirModalHotel } = useOutletContext();
  return <ListaProductos onEditHotel={abrirModalHotel} />;
}

export default AdminProductos;
