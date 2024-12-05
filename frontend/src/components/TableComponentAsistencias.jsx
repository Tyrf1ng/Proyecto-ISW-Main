
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableComponentAsistencias = ({ asistencias, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Fecha
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Nombre del Alumno
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  RUT
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Estado
                </th>
                <th className="relative py-3.5 px-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {asistencias.map((asistencia) => (
                <tr key={asistencia.id_asistencia}>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="text-gray-800 dark:text-white">
                      {new Date(asistencia.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="text-gray-800 dark:text-white">
                      {asistencia.alumno.nombre} {asistencia.alumno.apellido}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="text-gray-800 dark:text-white">
                      {asistencia.rut_alumno}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div
                      className={`inline px-3 py-1 text-sm font-normal rounded-full ${
                        asistencia.tipo === "Presente"
                          ? "bg-green-500 text-white"
                          : asistencia.tipo === "Ausente"
                          ? "bg-red-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {asistencia.tipo}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="flex space-x-2">
                      <IconButton color="primary" onClick={() => handleEdit(asistencia)}
                        aria-label="Editar"
                      >
                        <EditIcon />
                      </IconButton>

                      {/* Botón Eliminar */}
                      <IconButton 
                        color="primary" 
                        onClick={() => handleDelete(asistencia.id_asistencia)} 
                        aria-label="Eliminar"
                      >
                        <DeleteIcon className='text-red-500' />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComponentAsistencias;
