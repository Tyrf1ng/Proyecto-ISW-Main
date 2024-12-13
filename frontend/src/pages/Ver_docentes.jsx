import { useEffect, useState } from 'react';
import { getRutsDocentes, deleteUsuario } from '../services/usuarios.service'; 
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Ver_Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [id_roles, setId_roles] = useState('Admin');

  const rolMapping = {
    1: 'Directivo',
    2: 'Docente',
    3: 'Alumno',
    4: 'Enc. de Lab',
  };

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const docentesData = await getRutsDocentes();
        setDocentes(docentesData);
      } catch (error) {
        console.error('Error al cargar los docentes:', error);
      }
    };
    cargarDocentes();
  }, []);

  const filteredDocentes = docentes.filter(docente =>
    `${docente.nombre} ${docente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (rut) => {
    try {
      await deleteUsuario(rut);
      setDocentes(docentes.filter((docente) => docente.rut !== rut));
      setMessage('Docente eliminado exitosamente.');
      setMessageType('success');
    } catch (error) {
      setMessage('Hubo un error al eliminar el docente.');
      setMessageType('error');
    }
  };

  return (
    <div className="p-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Gestión de Docentes</h2>

      <div className="mb-4">
        <label htmlFor="search" className="block text-sm text-gray-500 dark:text-gray-300">Buscar Docente</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Nombre Completo</th>
                  <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Correo</th>
                  <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Rol</th>
                  {id_roles === 'Admin' && <th className="relative py-3.5 px-4"><span className="sr-only">Acciones</span></th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {filteredDocentes.length > 0 ? (
                  filteredDocentes.map((docente) => (
                    <tr key={docente.rut}>
                      <td className="px-4 py-4 text-sm font-medium whitespace-normal max-w-xs break-words">
                        <div>
                          <h2 className="font-medium text-gray-800 dark:text-white">{docente.nombre} {docente.apellido}</h2>
                        </div>
                      </td>
                      <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">{docente.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">
                          {rolMapping[docente.id_roles] || 'Rol desconocido'}
                        </div>
                      </td>
                      {id_roles === 'Admin' && (
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex space-x-2">
                            <IconButton color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={() => handleDelete(docente.rut)}>
                              <DeleteIcon className="text-red-500" />
                            </IconButton>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No hay docentes para mostrar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
                {messageType.charAt(0).toUpperCase() + messageType.slice(1)}!
              </span>
              <p className="mt-1 text-sm text-white">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ver_Docentes;
