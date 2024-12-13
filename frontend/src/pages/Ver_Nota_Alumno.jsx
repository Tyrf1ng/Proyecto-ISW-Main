import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TableComponent from '@components/TableNotas';
import useNotasAsignatura from '@hooks/notas/useNotasAsignatura';
import { UsuarioContext } from '@context/UsuarioContext';

const VerNotaAlumno = () => {

  const [filterText, setFilterText] = useState('');
  const { usuario,cargarUsuario } = useContext(UsuarioContext);
  const { notas, loading, error } = useNotasAsignatura([]);

console.log("notas",notas)
  // Validación inicial del usuario
  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    }
  }, [usuario, cargarUsuario]);

  if (!usuario) {
    return <div>Cargando usuario...</div>;
  }

  // Filtrado de las notas
  const filteredNotas = notas?.filter((nota) =>
    nota.tipo.toLowerCase().includes(filterText.toLowerCase())
  ) || [];

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
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
            <input
              type="text"
              value={filterText}
              onChange={handleFilterChange}
              placeholder="Filtrar por Tipo de Evaluación..."
              className="w-96 p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
            />
          </Box>

          {/* Contenido dinámico */}
          {loading ? (
            <p>Cargando notas...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <TableComponent 
              notas={filteredNotas} 
              role={usuario?.rol}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default VerNotaAlumno;

