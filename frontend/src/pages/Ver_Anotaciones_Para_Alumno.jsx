import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { getAnotacionesAlumno } from '@services/anotaciones.service'; // Servicio para obtener anotaciones por RUT

const Ver_Anotaciones_Para_Alumno = () => {
  const [anotaciones, setAnotaciones] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [cargando, setCargando] = useState(true);
  const [rut, setRut] = useState('');

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado && usuarioGuardado.rut) {
      setRut(usuarioGuardado.rut);
      cargarAnotaciones(usuarioGuardado.rut);
    }
  }, []);

  const cargarAnotaciones = async (rutAlumno) => {
    try {
      const datosAnotaciones = await getAnotacionesAlumno(rutAlumno);
      setAnotaciones(datosAnotaciones || []); // Asegúrate de asignar un array vacío si no hay datos
    } catch (error) {
      console.error('Error al cargar las anotaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const filteredAnotaciones = anotaciones.filter((anotacion) =>
    anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

  if (cargando) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anotaciones del Alumno
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
          label="Filtrar por descripción"
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
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnotaciones.length > 0 ? (
              filteredAnotaciones.map((anotacion) => (
                <TableRow key={anotacion.id_anotacion}>
                  <TableCell>{anotacion.tipo}</TableCell>
                  <TableCell>{anotacion.descripcion}</TableCell>
                  <TableCell>
                    {new Date(anotacion.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay anotaciones disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ver_Anotaciones_Para_Alumno;
