import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { getNotasPorRUT } from '@services/notas.service';
import TableComponent from '@components/TableNotas'; // Ajusta la ruta según tu proyecto

const Ver_Nota_Alumno = () => {
  const [notas, setNotas] = useState([]);
  const [rut, setRUT] = useState('');
  const [role, setRole] = useState(null); // Role del usuario autenticado
  const [filterText, setFilterText] = useState('');

  const filteredNotas = notas.filter((nota) =>
    nota.tipo.toLowerCase().includes(filterText.toLowerCase())
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
      <Typography variant="h4" gutterBottom>
        Notas del Alumno
      </Typography>
      <Typography variant="h6" gutterBottom>
        RUT: {rut}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <TextField
          label="Filtrar por Tipo"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
      </Box>
      <TableComponent
        notas={filteredNotas}
        role={role}
        />
    </Box>
  );
};

export default Ver_Nota_Alumno;
