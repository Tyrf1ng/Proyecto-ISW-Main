import { useState } from 'react';
import Box from '@mui/material/Box';
import TableComponent from '@components/TableNotas';
import useNotasAsignatura from '@hooks/notas/useNotasAsignatura';
import useUsuario from '@hooks/useUsuario';

const VerNotaAlumno = () => {
  const [filterType, setFilterType] = useState('');
  const { usuario } = useUsuario();
  const { notas, loading, error } = useNotasAsignatura([]);


  // Filtrado de las notas
  const filteredNotas = filterType
    ? notas?.filter((nota) => nota.tipo.toLowerCase() === filterType.toLowerCase()) || []
    : notas || [];

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Validación del usuario */}
      {!usuario || !usuario.rut ? (
        <p>Error: No se encontró información del usuario</p>
      ) : (
        <>
          {/* Barra de filtro */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <div className="mb-0">
              <label
                htmlFor="tipo"
                className="block text-sm text-gray-500 dark:text-gray-300"
              >
                Tipo de Nota
              </label>
              <select
                name="tipo"
                id="tipo"
                value={filterType}
                onChange={handleFilterChange}
                className=" mb-0 mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="">Todos los tipos</option>
                <option value="Prueba">Prueba</option>
                <option value="Tarea">Tarea</option>
                <option value="Test">Test</option>
                <option value="Presentacion">Presentación</option>
              </select>
            </div>
          </Box>

          {/* Contenido Tablas*/}
          {loading ? (
            <p>Cargando notas...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <TableComponent notas={filteredNotas} role={usuario?.rol} />
          )}
        </>
      )}
    </Box>
  );
};

export default VerNotaAlumno;
