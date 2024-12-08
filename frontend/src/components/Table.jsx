import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsuarioByRut } from '@services/usuarios.service'; 

const TableAnotacionComponent = ({ anotaciones, handleOpen, handleDelete, role }) => {
  const [usuarios, setUsuarios] = useState({});
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosByRut = {};
      for (let anotacion of anotaciones) {
        if (!usuariosByRut[anotacion.rut]) {
          try {
            const usuario = await getUsuarioByRut(anotacion.rut);
            usuariosByRut[anotacion.rut] = usuario.nombre;
          } catch (error) {
            console.error('Error al obtener el usuario por rut', error);
          }
        }
      }
      setUsuarios(usuariosByRut);
    };

    if (anotaciones.length > 0) {
      fetchUsuarios();
    }
  }, [anotaciones]);

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {role === 'Docente' && (
                  <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Nombre
                  </th>
                )}
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Tipo
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Fecha
                </th>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <button className="flex items-center gap-x-3 focus:outline-none">
                    <span>Descripción</span>
                  </button>
                </th>
                {role === 'Docente' && (
                  <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {anotaciones.length > 0 ? (
                anotaciones.map((anotacion) => (
                  <tr key={anotacion.id_anotacion}>
                    {role === 'Docente' && (
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">
                          {usuarios[anotacion.rut] || 'Cargando...'}
                        </div>
                      </td>
                    )}
                    <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                      <div
                        className={`inline px-3 py-1 text-sm font-normal rounded-full ${
                          anotacion.tipo === 'Positiva'
                            ? 'text-white bg-emerald-500'
                            : 'text-white bg-red-500'
                        }`}
                      >
                        {anotacion.tipo}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">
                        {new Date(anotacion.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium whitespace-normal max-w-xs break-words">
                      <div>
                        <h2 className="font-medium text-gray-800 dark:text-white">
                          {anotacion.descripcion}
                        </h2>
                      </div>
                    </td>
                    {role === 'Docente' && (
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-2">
                          <IconButton color="primary" onClick={() => handleOpen(anotacion)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleDelete(anotacion.id_anotacion)}>
                            <DeleteIcon className="text-red-500" />
                          </IconButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'Docente' ? '5' : '4'} className="text-center py-4 text-gray-500">
                    No hay anotaciones para este curso
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableAnotacionComponent;
