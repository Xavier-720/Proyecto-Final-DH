import useDatos from '../../hooks/useDatos';
import useAvisos from '../../hooks/useAvisos';
import { eliminarHotel } from '../../services/hotelService';
import './Admin.css';

// US#10 y US#11: lista de hoteles con editar y eliminar
function ListaProductos({ onEditHotel }) {
  const { hoteles, quitarHotel } = useDatos();
  const { mostrarToast, confirmar } = useAvisos();

  const eliminar = async (hotel) => {
    const acepto = await confirmar({
      titulo: '¿Eliminar el producto?',
      mensaje: `Vas a eliminar "${hotel.nombre}". Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
    });
    if (!acepto) return;

    try {
      await eliminarHotel(hotel.id);
      quitarHotel(hotel.id);
      mostrarToast('Producto eliminado correctamente.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
  };

  return (
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
              <td><span className="category-badge">{hotel.categoria?.titulo || 'Sin Categoría'}</span></td>
              <td className="table-actions">
                <button className="edit-btn" onClick={() => onEditHotel(hotel)}>Editar</button>
                <button className="delete-btn" onClick={() => eliminar(hotel)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaProductos;
