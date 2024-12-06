import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { getNotasPorRUT } from '@services/notas.service';
import TableComponent from '@components/TableNotas'; // Ajusta la ruta según tu proyecto

const Ver_Nota_Alumno = () => {
  const [notas, setNotas] = useState([]);
  const [rut, setRUT] = useState('');
  const [role, setRole] = useState(null); // Role del usuario autenticado
  const [filterText, setFilterText] = useState('');

  const filteredNotas = notas.filter((nota) =>
    nota.nombre_asignatura.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setRUT(usuarioGuardado.rut || '');
      setRole(usuarioGuardado.role || null); // Obtener el rol automáticamente
      fetchNotas(usuarioGuardado.rut);
    }
  }, []);

  const fetchNotas = async (rut) => {
    try {
      const response = await getNotasPorRUT(rut);
      if (response && response.status === 'Success' && Array.isArray(response.data)) {
        setNotas(response.data);
      } else {
        console.error('Respuesta inesperada:', response);
        setNotas([]);
      }
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      setNotas([]);
    }
  };

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
          marginBottom: 0,
        }}
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <input 
        type="text" 
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Filtrar por asignatura"
          className="w-96 p-2 border rounded dark:text-gray-300 dark:bg-gray-900"
        />
          </div>
      </Box>
      <TableComponent
        notas={filteredNotas}
        role={role}
        />
    </Box>
  );
};

export default Ver_Nota_Alumno;
