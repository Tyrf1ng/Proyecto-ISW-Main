import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { getCursos } from '@services/cursos.service.js';


const Notas = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate(); // Hook para redirigir

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

  const registrarNotas = (cursoId) => {
    alert(`Registrar notas para el curso con ID: ${cursoId}`);
  };

  const verNotas = (cursoId) => {
    // Redirige a la página VerNotas pasando el ID del curso como parámetro
    navigate(`/notas/${cursoId}`);
  };

  if (cargando) {
    return <p>Cargando Asignatura..</p>;
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#E6EFF8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#133B5C' }}>
        Mis Asignaturas
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
            key={curso.id || index} // Asegúrate de que la key sea única
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
                onClick={() => registrarNotas(curso.id)}
                sx={{ marginRight: 1 }}
              >
                Registrar Notas
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => verNotas(curso.id)} // Redirige a la página de notas
              >
                Ver Notas
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Notas;
