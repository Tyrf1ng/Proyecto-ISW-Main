import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableHorarios = ({ horarios = [], handleOpen, handleDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'hora_inicio', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedHorarios = [...horarios].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const formatTime = (time) => {
    return time.slice(0, 5); 
  };

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => handleSort('hora_inicio')}>
                  <div className="flex items-center">
                    Hora inicio
                    {sortConfig.key === 'hora_inicio' ? (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    ) : (
                      <div className="flex items-center ml-1">
                        <span>↑</span>
                        <span>↓</span>
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => handleSort('hora_fin')}>
                  <div className="flex items-center">
                    Hora fin
                    {sortConfig.key === 'hora_fin' ? (
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {sortedHorarios.length > 0 ? (
                sortedHorarios.map((horario) => (
                  <tr key={horario.id_horario}>
                    <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{formatTime(horario.hora_inicio)}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{formatTime(horario.hora_fin)}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex space-x-2">
                        <IconButton color="primary" onClick={() => handleOpen(horario)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleDelete(horario)}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">No hay horarios disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableHorarios;