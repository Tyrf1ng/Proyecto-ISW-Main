import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getCursos } from '../services/cursos.service';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const Asistencia = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const cursosObtenidos = await getCursos();
        setCursos(cursosObtenidos);
      } catch (error) {
        console.error('Error al cargar los cursos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarCursos();
  }, []);

  const registrarAsistencia = (cursoId) => {
    navigate(`/RegistrarAsistencias/${cursoId}`); // Redirect to RegistrarAsistencias
  };

  const verAsistencias = (cursoId) => {
    navigate(`/VerAsistencias/${cursoId}`); // Redirect to VerAsistencias
  };

  if (cargando) {
    return <p>Cargando cursos...</p>;
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#E6EFF8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#133B5C' }}>
        Mis cursos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {cursos.map((curso, index) => (
          <Paper
            key={curso.id || index}
            sx={{
              width: '80%',
              padding: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#BBDEFB',
              borderRadius: '8px',
              color: '#133B5C',
            }}
          >
            <Typography variant="h6">{curso.nombre}</Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => registrarAsistencia(curso.id)}
                sx={{ marginRight: 1 }}
              >
                Registrar Asistencia
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => verAsistencias(curso.id)}
              >
                Ver Asistencias
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Asistencia;
