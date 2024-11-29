import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableHorarios = ({ horarios = [], handleOpen, handleDelete }) => {
  // Ordenar los horarios por hora de inicio
  const sortedHorarios = horarios.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  // Función para formatear la hora y quitar los segundos
  const formatTime = (time) => {
    return time.slice(0, 5); // Asumiendo que el formato es "HH:MM:SS"
  };

  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  N° Horario
                </th>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Hora inicio
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Hora fin
                </th>
                <th className="relative py-3.5 px-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {sortedHorarios.length > 0 ? (
                sortedHorarios.map((horario, index) => (
                  <tr key={horario.id_horario}>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div>
                        <h2 className="font-medium text-gray-800 dark:text-white">{index + 1}</h2>
                      </div>
                    </td>
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
                  <td colSpan="4" className="text-center py-4 text-gray-500">No hay horarios disponibles</td>
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