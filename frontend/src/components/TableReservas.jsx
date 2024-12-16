import { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableReservas = ({ reservas = [], handleOpen, handleDelete, showActions = true }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedReservas = [...reservas].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Docente
                </th>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => handleSort('fecha')}>
                  <div className="flex items-center">
                    Fecha
                    {sortConfig.key === 'fecha' ? (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    ) : (
                      <div className="flex items-center ml-1">
                        <span>↑</span>
                        <span>↓</span>
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => handleSort('horario')}>
                  <div className="flex items-center">
                    Horario
                    {sortConfig.key === 'horario' ? (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    ) : (
                      <div className="flex items-center ml-1">
                        <span>↑</span>
                        <span>↓</span>
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Laboratorio
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Asignatura
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Curso
                </th>
                {showActions && (
                  <th className="relative py-3.5 px-4">
                    <span className="sr-only">Acciones</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {sortedReservas.length > 0 ? (
                sortedReservas.map((reserva) => (
                  <tr key={reserva.id_reserva}>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{reserva.usuario}</div>
                    </td>
                    <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{formatDate(reserva.fecha)}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{reserva.horario}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{reserva.nombre_lab}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{reserva.nombre_asignatura}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{reserva.nombreCurso}</div>
                    </td>
                    {showActions && (
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-2">
                          <IconButton color="primary" onClick={() => handleOpen(reserva)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleDelete(reserva)}>
                            <DeleteIcon className="text-red-500" />
                          </IconButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No hay reservas disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableReservas;