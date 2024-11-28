import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableComponent = ({ anotaciones, handleOpen, handleDelete }) => {
  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <button className="flex items-center gap-x-3 focus:outline-none">
                    <span>Descripción</span>
                  </button>
                </th>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Tipo
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  RUT del Alumno
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Fecha de Creación
                </th>
                <th className="relative py-3.5 px-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {anotaciones.length > 0 ? (
                anotaciones.map((anotacion) => (
                  <tr key={anotacion.id_anotacion}>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div>
                        <h2 className="font-medium text-gray-800 dark:text-white">{anotacion.descripcion}</h2>
                      </div>
                    </td>
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
                    {/* RUT del Alumno con estilo según modo oscuro o claro */}
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{anotacion.rut_alumno}</div>
                    </td>
                    {/* Fecha de creación con estilo según modo oscuro o claro */}
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{new Date(anotacion.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex space-x-2">
                        <IconButton color="primary" onClick={() => handleOpen(anotacion)}>
                          <EditIcon />
                        </IconButton>
                        {/* Icono Delete con color rojo */}
                        <IconButton color="primary" onClick={() => handleDelete(anotacion.id_anotacion)}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No hay anotaciones para este curso</td>
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
