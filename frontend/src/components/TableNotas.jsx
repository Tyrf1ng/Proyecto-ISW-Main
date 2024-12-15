import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsuarioByRut } from '@services/usuarios.service';
import { prettifyRut } from "react-rut-formatter"; // Formatear RUT

const TableComponent = ({ notas, onEdit, onDelete, role }) => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [usuarios, setUsuarios] = useState({});
  const [sortedNotas, setSortedNotas] = useState(notas);

  const sortNotasByNombre = () => {
    const sorted = [...sortedNotas].sort((a, b) => {
      const nombreA = usuarios[a.rut]?.nombre || '';
      const nombreB = usuarios[b.rut]?.nombre || '';
      if (nombreA > nombreB) return sortOrder === 'asc' ? 1 : -1;
      if (nombreA < nombreB) return sortOrder === 'asc' ? -1 : 1;
      return 0;
    });

    setSortedNotas(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortNotasByTipo = () => {
    const sorted = [...sortedNotas].sort((a, b) => {
      if (a.tipo > b.tipo) return sortOrder === 'asc' ? 1 : -1;
      if (a.tipo < b.tipo) return sortOrder === 'asc' ? -1 : 1;
      return 0;
    });

    setSortedNotas(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosByRut = {};
      for (let nota of notas) {
        if (!usuariosByRut[nota.rut]) {
          try {
            const usuario = await getUsuarioByRut(nota.rut);
            usuariosByRut[nota.rut] = { nombre: usuario.nombre, apellido: usuario.apellido };
          } catch (error) {
            console.error('Error al obtener el usuario por rut', error);
          }
        }
      }
      setUsuarios(usuariosByRut);
    };

    if (notas.length > 0) {
      fetchUsuarios();
    }

    setSortedNotas(notas);
  }, [notas]);

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400 cursor-pointer"
                  onClick={sortNotasByTipo}
                >
                  Tipo {sortOrder === 'asc' ? '↑' : '↓'}
                </th>
                <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Valor</th>

                {role === 'Docente' && (
                  <>
                    <th
                      className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer"
                      onClick={sortNotasByNombre}
                    >
                      Alumno {sortOrder === 'asc' ? '↑' : '↓'}
                    </th>
                    <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">
                      RUT del Alumno
                    </th>
                    <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Acciones</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {sortedNotas && sortedNotas.length > 0 ? (
                sortedNotas.map((nota) => (
                  <tr key={nota.id_nota}>
                    <td className="p-4 text-sm font-medium whitespace-nowrap">
                      <div className="inline px-3 py-1 text-sm font-normal rounded-full text-white bg-gray-500">
                        {nota.tipo}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium whitespace-nowrap">
                      <div
                        className={`inline px-3 py-1 text-sm font-normal rounded-full ${
                          nota.valor < 4.0 ? 'text-white bg-red-500' : 'text-white bg-emerald-500'
                        }`}
                      >
                        {nota.valor}
                      </div>
                    </td>

                    {role === 'Docente' && (
                      <>
                        <td className="p-4 text-sm whitespace-nowrap">
                          <div className="text-gray-800 dark:text-white">
                            {`${usuarios[nota.rut]?.nombre || 'Cargando...'} ${
                              usuarios[nota.rut]?.apellido || ''
                            }`}
                          </div>
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap">
                          <div className="text-gray-800 dark:text-white">
                            {prettifyRut(nota.rut)} 
                          </div>
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap">
                          <IconButton color="primary" onClick={() => onEdit(nota)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => onDelete(nota.id_nota)}>
                            <DeleteIcon className="text-red-500" />
                          </IconButton>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No hay notas registradas
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

export default TableComponent;
