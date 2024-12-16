import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TableComponentAsistencias = ({
  asistencias,
  handleEdit,
  handleDelete,
  showActions = true,
  formatFecha,
  renderEstado,
  renderObservacion,
  prettifyRut
}) => {
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
                {showActions ? (
                  <>
                    <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      Nombre
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      RUT
                    </th>
                  </>
                ) : null}
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Estado
                </th>
                <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Observación
                </th>
                {showActions && (
                  <th className="relative py-3.5 px-4">
                    <span className="sr-only">Acciones</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {asistencias.map((asistencia, index) => (
                <tr key={`${asistencia.id_asistencia}-${index}`}>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <div className="text-gray-800 dark:text-white">
                      {asistencia.createdAt
                        ? formatFecha(asistencia.createdAt)
                        : "Sin Fecha"}
                    </div>
                  </td>
                  {showActions ? (
                    <>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">
                          {asistencia.nombre} {asistencia.apellido}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800 dark:text-white">
                          {prettifyRut(asistencia.rut)}
                        </div>
                      </td>
                    </>
                  ) : null}
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {renderEstado(asistencia.tipo)}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {renderObservacion(asistencia.observacion)}
                  </td>
                  {showActions && (
                    <td className="px-4 py-4 text-sm whitespace-nowrap ">
                      <div className="flex space-x-2">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(asistencia)}
                          aria-label="Editar"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="primary"
                          onClick={() => handleDelete(asistencia.id_asistencia)}
                          aria-label="Eliminar"
                        >
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </div>
                    </td>
                  )}
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
