import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createAsistencia } from '../services/Asistencias.service';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const RegistrarAsistencias = () => {
  const { id_curso } = useParams();
  const [rutAlumno, setRutAlumno] = useState('');
  const [estado, setEstado] = useState('');
  const [observacion, setObservacion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        id_asignatura: id_curso,
        rut_alumno: rutAlumno,
        tipo: estado,
        observacion: estado === 'Justificado' ? observacion : null,
      };
      await createAsistencia(data);
      setMensaje('¡Asistencia registrada exitosamente!');
      setRutAlumno('');
      setEstado('');
      setObservacion('');
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      setMensaje('Hubo un error al registrar la asistencia.');
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#E6EFF8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#133B5C' }}>
        Registrar Asistencia
      </Typography>
      <form onSubmit={manejarSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="RUT del Alumno"
            value={rutAlumno}
            onChange={(e) => setRutAlumno(e.target.value)}
            required
            InputProps={{
              style: { color: '#133B5C' },
            }}
            InputLabelProps={{
              style: { color: '#133B5C' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#133B5C',
                },
                '&:hover fieldset': {
                  borderColor: '#133B5C',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#133B5C',
                },
              },
            }}
          />
          <FormControl required>
            <InputLabel
              sx={{
                color: '#133B5C',
              }}
            >
              Estado
            </InputLabel>
            <Select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              label="Estado" // Agregar el label aquí
              sx={{
                color: '#133B5C',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#133B5C',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#133B5C',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#133B5C',
                },
                '& .MuiSvgIcon-root': {
                  color: '#133B5C', // Cambiar el color de la flecha de despliegue
                },
              }}
            >
              <MenuItem value="Presente">Presente</MenuItem>
              <MenuItem value="Ausente">Ausente</MenuItem>
              <MenuItem value="Justificado">Justificado</MenuItem>
            </Select>
          </FormControl>
          {estado === 'Justificado' && (
            <TextField
              label="Observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              InputProps={{
                style: { color: '#133B5C' },
              }}
              InputLabelProps={{
                style: { color: '#133B5C' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#133B5C',
                  },
                  '&:hover fieldset': {
                    borderColor: '#133B5C',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#133B5C',
                  },
                },
              }}
            />
          )}
          <Button type="submit" variant="contained" color="primary">
            Registrar
          </Button>
        </Box>
      </form>
      {mensaje && (
        <Typography variant="h6" align="center" sx={{ marginTop: 2, color: '#133B5C' }}>
          {mensaje}
        </Typography>
      )}
    </Box>
  );
};

export default RegistrarAsistencias;
