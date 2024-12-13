import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TableLabs = ({ labs = [], handleOpen, handleDelete, handleSort, sortConfig }) => {
  return (
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Nombre
                </th>
                <th className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => handleSort('capacidad')}>
                  <div className="flex items-center">
                    Capacidad
                    {sortConfig.key === 'capacidad' ? (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    ) : (
                      <div className="flex items-center ml-1">
                        <span>↑</span>
                        <span>↓</span>
                      </div>
                    )}
                  </div>
                </th>
                <th className="relative py-3.5 px-4">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {labs.length > 0 ? (
                labs.map((lab) => (
                  <tr key={lab.id_lab}>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{lab.nombre}</div>
                    </td>
                    <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="text-gray-800 dark:text-white">{lab.capacidad}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex space-x-2">
                        <IconButton color="primary" onClick={() => handleOpen(lab)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleDelete(lab)}>
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">No hay laboratorios disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableLabs;