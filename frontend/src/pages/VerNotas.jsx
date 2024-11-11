import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useNotasAsignatura from '@hooks/notas/useNotas'; // Importa el hook para obtener las notas
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const VerNotas = () => {
  const { cursoId } = useParams(); // Obtener el ID del curso desde la URL
  const { notas = [], fetchNotas } = useNotasAsignatura(cursoId); // Usar el hook con el ID del curso
  const [filterIdAsignatura, setFilterIdAsignatura] = useState('');

  useEffect(() => {
    fetchNotas(); // Llamar a fetchNotas cada vez que el cursoId cambie
  }, [cursoId]);

  // Filtrar las notas por ID de asignatura
  const filteredNotas = Array.isArray(notas)
    ? notas.filter((nota) => !filterIdAsignatura || nota.id_asignatura === Number(filterIdAsignatura))
    : [];

  // Manejar el cambio en el campo de filtro por ID de asignatura
  const handleFilterIdAsignaturaChange = (e) => setFilterIdAsignatura(e.target.value);

  // Evitar que se envíe el formulario al presionar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Notas del Curso {cursoId}</Typography>

      {/* Filtro por ID de asignatura */}
      <TextField
        label="Filtrar por ID de asignatura"
        variant="outlined"
        value={filterIdAsignatura}
        onChange={handleFilterIdAsignaturaChange}
        onKeyDown={handleKeyPress}
        sx={{ marginBottom: 2 }}
      />

      {/* Tabla para mostrar las notas filtradas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>RUT del Alumno</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Asignatura</TableCell>
              <TableCell>ID Asignatura</TableCell>
              <TableCell>Nombre del Alumno</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotas.map((nota) => (
              <TableRow key={nota.id_nota}>
                <TableCell>{nota.tipo}</TableCell>
                <TableCell>{nota.rut_alumno}</TableCell>
                <TableCell>{nota.valor}</TableCell>
                <TableCell>{nota.nombre_asignatura}</TableCell>
                <TableCell>{nota.id_asignatura}</TableCell>
                <TableCell>{nota.nombre_alumno} {nota.apellido_alumno}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VerNotas;
