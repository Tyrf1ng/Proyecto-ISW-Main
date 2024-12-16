import React, { useState } from 'react';
import useAnotacionesAlumno from '../hooks/anotaciones/useAnotacionesAlumno';
import TableAnotacionComponent from '../components/Table';

const Ver_Anotaciones_Para_Alumno = () => {
  const { anotaciones, loading, error } = useAnotacionesAlumno();
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const filteredAnotaciones = anotaciones.filter((a) =>
    a.descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Cargando anotaciones...</div>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={filterText}
              onChange={handleFilterChange}
              placeholder="Filtrar anotaciones por descripción..."
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <TableAnotacionComponent
            anotaciones={filteredAnotaciones}
            role={anotaciones.length > 0 ? anotaciones[0].rol : null}
          />
        </>
      )}
    </div>
  );
};

export default Ver_Anotaciones_Para_Alumno;
