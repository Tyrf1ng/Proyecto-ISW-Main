import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { getNotasPorRUT } from '@services/notas.service';

const Ver_Nota_Alumno = () => {
  const [notas, setNotas] = useState([]);
  const [rut, setRUT] = useState('');
  const [filterText, setFilterText] = useState('');

  const filteredNotas = notas.filter((nota) =>
    nota.tipo.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado && usuarioGuardado.rut) {
      setRUT(usuarioGuardado.rut);
      fetchNotas(usuarioGuardado.rut);
    }
  }, []);

  const fetchNotas = async (rutAlumno) => {
    try {
      const response = await getNotasPorRUT(rutAlumno);
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        setNotas(response.data); // Extraer y asignar el array de notas
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Filtrar por Tipo"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Alumno</TableCell>
              <TableCell>Asignatura</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotas.length > 0 ? (
              filteredNotas.map((nota) => (
                <TableRow key={nota.id_nota}>
                  <TableCell>{nota.tipo}</TableCell>
                  <TableCell>{nota.valor}</TableCell>
                  <TableCell>{nota.rut_alumno}</TableCell>
                  <TableCell>{`${nota.nombre_alumno || ''} ${nota.apellido_alumno || ''}`}</TableCell>
                  <TableCell>{nota.nombre_asignatura || 'Sin nombre'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No hay notas disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ver_Nota_Alumno;
