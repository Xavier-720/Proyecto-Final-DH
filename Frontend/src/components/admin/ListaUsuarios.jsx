import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useAvisos from '../../hooks/useAvisos';
import { listarUsuarios, cambiarRol } from '../../services/usuarioService';
import './Admin.css';

// US#16: dar o quitar el permiso de admin
function ListaUsuarios() {
  const { usuario: usuarioActual } = useAuth();
  const { mostrarToast, confirmar } = useAvisos();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch((err) => mostrarToast(err.message, 'error'));
  }, [mostrarToast]);

  const alternarRol = async (usuario) => {
    const nuevoRol = usuario.rol === 'ADMIN' ? 'USER' : 'ADMIN';

    const acepto = await confirmar({
      titulo: nuevoRol === 'ADMIN' ? '¿Dar permisos de administrador?' : '¿Quitar permisos de administrador?',
      mensaje: `Vas a cambiar el rol de ${usuario.nombre} (${usuario.email}).`,
      textoConfirmar: 'Confirmar',
    });
    if (!acepto) return;

    try {
      const actualizado = await cambiarRol(usuario.id, nuevoRol);
      setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? actualizado : u)));
      mostrarToast('Rol actualizado correctamente.');
    } catch (err) {
      mostrarToast(err.message, 'error');
    }
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
            const esElMismo = u.id === usuarioActual?.id;
            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td><span className={`category-badge ${esAdmin ? 'admin-badge' : ''}`}>{esAdmin ? 'Admin' : 'Usuario'}</span></td>
                <td>
                  {/* un admin no puede quitarse a sí mismo el permiso */}
                  <button
                    className={esAdmin ? 'delete-btn' : 'action-btn'}
                    onClick={() => alternarRol(u)}
                    disabled={esElMismo}
                    title={esElMismo ? 'No podés cambiar tu propio rol' : undefined}
                  >
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
