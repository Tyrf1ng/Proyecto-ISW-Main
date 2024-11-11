import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAsistenciasCurso } from '../services/Asistencias.service'; // Importar el servicio adecuado
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

const VerAsistencias = () => {
  const { cursoId } = useParams();
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAsistencias = async () => {
      try {
        const datosAsistencias = await getAsistenciasCurso(cursoId);
        setAsistencias(datosAsistencias || []); // Asegurarse de que los datos se asignen correctamente
      } catch (error) {
        console.error('Error al cargar las asistencias:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarAsistencias();
  }, [cursoId]);

  if (cargando) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#E6EFF8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#133B5C' }}>
        Asistencias del Curso
      </Typography>
      {asistencias.length === 0 ? (
        <Typography variant="h6" align="center" sx = {{color: '#133B5C'}}>
          No hay asistencias registradas para este curso.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {asistencias.map((asistencia, index) => (
            <Paper
              key={index}
              sx={{
                padding: 2,
                backgroundColor: '#BBDEFB',
                borderRadius: '8px',
                color: '#133B5C',
              }}
            >
              <Typography variant="body1">
                Fecha: {asistencia.createdAt} - Estudiante: {asistencia.rut_alumno} - Estado: {asistencia.Tipo}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default VerAsistencias;
