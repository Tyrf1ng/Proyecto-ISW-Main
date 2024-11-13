import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { CursoContext } from '@context/CursoContext';
import useNotasCurso from '@hooks/notas/useNotas';
import TextField from '@mui/material/TextField';


const VerNotas = () => {
  const { idCurso } = useContext(CursoContext); // Obtener el ID del curso desde la URL
  const { notas, fetchNotas } = useNotasCurso(idCurso); // Obtener las notas del curso
  const [filterText, setFilterText] = useState('');
  const filteredNotas = notas.filter((notas) =>
    notas.nombre_alumno.toLowerCase().includes(filterText.toLowerCase())
  );


  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };


  useEffect(() => {
    if (idCurso) {
      fetchNotas();
    }
  }, [idCurso, fetchNotas]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notas del Curso {idCurso ? `del Curso: ${idCurso}` : ''}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <TextField
          label="Filtrar por Nombre del alumno"
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
              <TableCell>Alumno</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Asignatura</TableCell>
              <TableCell>ID Asignatura</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotas.length > 0 ? (
              filteredNotas.map((nota) => (
                <TableRow key={nota.id_nota}>
                  <TableCell>{nota.tipo}</TableCell>
                  <TableCell>{`${nota.nombre_alumno} ${nota.apellido_alumno}`}</TableCell>
                  <TableCell>{nota.rut_alumno}</TableCell>
                  <TableCell>{nota.valor}</TableCell>
                  <TableCell>{nota.nombre_asignatura}</TableCell>
                  <TableCell>{nota.id_asignatura}</TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay notas el alumno para este curso 
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
          

export default VerNotas;