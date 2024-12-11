import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TableComponent from '@components/TableNotas';
import useNotasAsignatura from '@hooks/notas/useNotasAsignatura';
import { UsuarioContext } from '@context/UsuarioContext';

const VerNotaAlumno = () => {
  const [filterText, setFilterText] = useState('');
  const { usuario } = useContext(UsuarioContext);
  const { notas, loading, error, fetchNotas } = useNotasAsignatura([]);

  const filteredNotas = notas?.filter((nota) =>
    nota.nombre_asignatura.toLowerCase().includes(filterText.toLowerCase())
  ) || [];


  useEffect(() => {
    if (fetchNotas) {
      fetchNotas();
    }
  }, [fetchNotas]);  


  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar por Tipo de Evaluación..."
          className="w-96 p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
        />
      </Box>
      {loading ? (
        <p>Cargando notas...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableComponent 
          notas={filteredNotas} 
          role={usuario?.rol}  // Asegúrate de que user tenga un rol
        />
      )}
    </Box>
  );
};

export default VerNotaAlumno;

