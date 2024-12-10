import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import { AsignaturaContext } from '@context/AsignaturaContext';
import TableComponent from '@components/TableNotas';
import useNotasAsignatura from '@hooks/notas/useNotasAsignatura';
import { useAuth } from '@context/AuthContext';

const VerNotaAlumno = () => {
  const { idAsignatura } = useContext(AsignaturaContext); // Obtiene el id_asignatura del contexto
  const { isAuthenticated, user } = useAuth(); // Obtiene el estado de autenticación y el usuario del contexto
  const [filterText, setFilterText] = useState('');
  const { notas, loading, error, fetchNotas } = useNotasAsignatura(user?.rut, idAsignatura);

  const filteredNotas = notas
    ? notas.filter((nota) =>
        nota.nombre_asignatura.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isAuthenticated && user?.rut && idAsignatura) {
      fetchNotas(); 
    }
  }, [isAuthenticated, user?.rut, idAsignatura, fetchNotas]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };
console.log("notas", notas)
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
          placeholder="Filtrar por asignatura"
          className="w-96 p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
        />
      </Box>
      {loading ? (
        <p>Cargando notas...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableComponent 
        notas={filteredNotas} role={isAuthenticated.role} />
      )}
    </Box>
  );
};

export default VerNotaAlumno;