import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUsuarioByRut } from '@services/usuarios.service';

const TableAnotacionComponent = ({ anotaciones, handleOpen, handleDelete, role }) => {
  const [usuarios, setUsuarios] = useState({});
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortOrderNombre, setSortOrderNombre] = useState('asc');
  const [sortedAnotaciones, setSortedAnotaciones] = useState(anotaciones);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const sortAnotacionesByType = () => {
    const sorted = [...anotaciones].sort((a, b) => {
      if (a.tipo > b.tipo) return sortOrder === 'asc' ? 1 : -1;
      if (a.tipo < b.tipo) return sortOrder === 'asc' ? -1 : 1;
      return 0;
    });

    setSortedAnotaciones(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const sortAnotacionesByNombre = () => {
    const sorted = [...anotaciones].sort((a, b) => {
      const nombreA = usuarios[a.rut] ? usuarios[a.rut].nombre : '';
      const nombreB = usuarios[b.rut] ? usuarios[b.rut].nombre : '';
      if (nombreA > nombreB) return sortOrderNombre === 'asc' ? 1 : -1;
      if (nombreA < nombreB) return sortOrderNombre === 'asc' ? -1 : 1;
      return 0;
    });

    setSortedAnotaciones(sorted);
    setSortOrderNombre(sortOrderNombre === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosByRut = {};
      for (let anotacion of anotaciones) {
        if (!usuariosByRut[anotacion.rut]) {
          try {
            const usuario = await getUsuarioByRut(anotacion.rut);
            usuariosByRut[anotacion.rut] = usuario;
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

    setSortedAnotaciones(anotaciones);
    setCurrentPage(1);
  }, [anotaciones]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAnotaciones = sortedAnotaciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAnotaciones.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {role === 'Docente' && (
                  <th
                    className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={sortAnotacionesByNombre}
                  >
                    Nombre
                    {sortOrderNombre === 'asc' ? ' ↑' : ' ↓'}
                  </th>
                )}
                <th
                  className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer"
                  onClick={sortAnotacionesByType}
                >
                  Tipo
                  {sortOrder === 'asc' ? ' ↑' : ' ↓'}
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
              {currentAnotaciones.length > 0 ? (
                currentAnotaciones.map((anotacion) => (
                  <tr key={anotacion.id_anotacion}>
                    {role === 'Docente' && (
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">
                          {usuarios[anotacion.rut]
                            ? `${usuarios[anotacion.rut].nombre} ${usuarios[anotacion.rut].apellido}`
                            : 'Cargando...'}
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
                        {new Date(anotacion.createdAt).toLocaleDateString('es-ES')}
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

      {sortedAnotaciones.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-6 mx-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
            <span>Anterior</span>
          </button>

          <div className="items-center hidden md:flex gap-x-3">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-2 py-1 text-sm rounded-md ${
                  currentPage === number
                    ? 'text-blue-500 bg-blue-100/60 dark:bg-gray-800'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <span>Siguiente</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default TableAnotacionComponent;
