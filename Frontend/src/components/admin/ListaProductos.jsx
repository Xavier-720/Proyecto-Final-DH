import { API_URL, leerError } from '../../services/api';

// US#10 y US#11: lista de hoteles con editar y eliminar
function ListaProductos({ hoteles, onEditHotel, onDeleteHotel }) {
  const eliminar = (hotel) => {
    if (!window.confirm(`¿Seguro que querés eliminar "${hotel.nombre}"?`)) return;

    fetch(`${API_URL}/hoteles/${hotel.id}`, { method: 'DELETE' })
      .then(async (res) => {
        if (!res.ok) throw new Error(await leerError(res, 'No se pudo eliminar el producto.'));
        onDeleteHotel(hotel.id);
      })
      .catch((err) => alert(err.message));
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
              <td><span className="category-badge">{hotel.categoria || 'Sin Categoría'}</span></td>
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
