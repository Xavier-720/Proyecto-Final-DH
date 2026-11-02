import { useState, useEffect } from 'react';
import { API_URL } from '../../services/api';

// US#16: dar o quitar el permiso de admin
function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/auth/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error('Error al cargar usuarios:', err));
  }, []);

  const cambiarRol = (usuario) => {
    const nuevoRol = usuario.rol === 'ADMIN' ? 'USER' : 'ADMIN';

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
        setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? { ...u, rol: data.rol } : u)));
      })
      .catch(() => alert('No se pudo actualizar el rol del usuario.'));
  };

  return (
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
          {usuarios.map((u) => {
            const esAdmin = u.rol === 'ADMIN';
            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td><span className={`category-badge ${esAdmin ? 'admin-badge' : ''}`}>{esAdmin ? 'Admin' : 'Usuario'}</span></td>
                <td>
                  <button className={esAdmin ? 'delete-btn' : 'action-btn'} onClick={() => cambiarRol(u)}>
                    {esAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListaUsuarios;
