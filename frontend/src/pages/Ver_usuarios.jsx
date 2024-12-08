import { useEffect, useState } from 'react';
import { getUsuarios, updateUsuario, deleteUsuario } from '../services/usuarios.service';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Ver_Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [id_roles, setId_roles] = useState('Admin'); // Definir el rol de usuario, por ejemplo 'Admin'

  // Mapeo de id_roles a nombres legibles
  const rolMapping = {
    1: 'Directivo',
    2: 'Docente',
    3: 'Alumno',
    4: 'Enc. de Lab',
  };

  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      }
    };
    cargarUsuarios();
  }, []);

  // Manejar búsqueda de usuarios
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar la selección de un usuario
  const handleSelectUsuario = (usuario) => {
    setSelectedUsuario(usuario);
  };

  // Actualizar un usuario
  const handleUpdate = async (usuario) => {
    // Lógica de actualización de usuario
  };

  // Eliminar un usuario utilizando el RUT
  const handleDelete = async (rut) => {
    try {
      await deleteUsuario(rut); // Pasamos el RUT en vez de la ID
      setUsuarios(usuarios.filter((usuario) => usuario.rut !== rut)); // Filtramos por RUT
      setMessage('Usuario eliminado exitosamente.');
      setMessageType('success');
    } catch (error) {
      setMessage('Hubo un error al eliminar el usuario.');
      setMessageType('error');
    }
  };

  // Filtrar los usuarios en función del término de búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Gestión de Usuarios</h2>

      {/* Búsqueda de usuario */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm text-gray-500 dark:text-gray-300">
          Buscar Usuario
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Nombre Completo
                  </th>
                  <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Correo
                  </th>
                  <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Rol
                  </th>
                  <th className="relative py-3.5 px-4">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <tr key={usuario.rut}> {/* Usamos el RUT como key */}
                      <td className="px-4 py-4 text-sm font-medium whitespace-normal max-w-xs break-words">
                        <div>
                          <h2 className="font-medium text-gray-800 dark:text-white">
                            {usuario.nombre} {usuario.apellido}
                          </h2>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">{usuario.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">
                          {rolMapping[usuario.id_roles] || 'Rol desconocido'}
                        </div>
                      </td>
                      {id_roles === 'Admin' && (
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex space-x-2">
                            <IconButton color="primary" onClick={() => handleSelectUsuario(usuario)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={() => handleDelete(usuario.rut)}>
                              <DeleteIcon className="text-red-500" />
                            </IconButton>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No hay usuarios para mostrar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Aquí iría el mensaje de notificación */}
      {message && (
        <div className="fixed top-5 right-5 w-full max-w-sm overflow-hidden bg-[#111827] rounded-lg shadow-md z-50 animate-bounce-slow">
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span
                className={`font-semibold ${
                  messageType === 'success'
                    ? 'text-emerald-500'
                    : messageType === 'error'
                    ? 'text-red-500'
                    : 'text-yellow-400'
                }`}
              >
                {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
              </span>
              <p className="text-sm text-gray-100">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ver_Usuarios;
