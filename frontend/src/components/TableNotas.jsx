import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableComponent = ({ notas, onEdit, onDelete, role }) => {
  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Tipo</th>
                <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Valor</th>
                <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">RUT</th>
                <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Alumno</th>
                <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Asignatura</th>
                {role === 2 && (
                  <th className="p-4 text-left text-sm font-normal text-gray-500 dark:text-gray-400">Acciones</th>
                  
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {notas && notas.length > 0 ? (
                    notas.map((nota) => (
                    <tr key={nota.id_nota}>
                      {/* Columna Tipo */}
                      <td className="p-4 text-sm font-medium whitespace-nowrap">
                        <div className="inline px-3 py-1 text-sm font-normal rounded-full text-white bg-gray-500">
                          {nota.tipo}
                        </div>
                      </td>

                      {/* Columna Valor */}
                      <td className="p-4 text-sm font-medium whitespace-nowrap">
                        <div
                          className={`inline px-3 py-1 text-sm font-normal rounded-full ${
                            nota.valor < 4.0 ? 'text-white bg-red-500' : 'text-white bg-emerald-500'
                          }`}
                        >
                          {nota.valor}
                        </div>
                      </td>

                      {/* RUT del Alumno */}
                      <td className="p-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">{nota.rut}</div>
                      </td>

                      {/* Alumno */}
                      <td className="p-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">{`${nota.nombre_alumno} ${nota.apellido_alumno}`}</div>
                      </td>

                      {/* Asignatura */}
                      <td className="p-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">{nota.nombre_asignatura}</div>
                      </td>

                      {/* Acciones (solo para role === 2) */}
                      {role === 2 && (
                        <td className="p-4 text-sm whitespace-nowrap">
                          <div className="flex space-x-2">
                            <IconButton color="primary" onClick={() => onEdit(nota)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="primary" onClick={() => onDelete(nota.id_nota)}>
                              <DeleteIcon className="text-red-500" />
                            </IconButton>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role === 2 ? 6 : 5} className="text-center py-4 text-gray-500">
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