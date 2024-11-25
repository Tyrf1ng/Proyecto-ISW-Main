import { useContext, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { CursoContext } from '../context/CursoContext';
import { getAlumnosByCurso } from '../services/alumnos.service';
import { createAnotacion } from '@services/anotaciones.service.js';

function Add_anotaciones() {
  const { idCurso } = useContext(CursoContext); // Obtén el curso actual del contexto
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut_alumno: '',
    descripcion: '',
    id_asignatura: idCurso || '',
    fecha: new Date().toISOString(),
  });
  const [message, setMessage] = useState('');
  const [alumnos, setAlumnos] = useState([]); // Siempre inicializa como un array vacío
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar alumnos del curso actual
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        const alumnosData = await getAlumnosByCurso(idCurso);
        console.log("Datos recibidos de la API:", alumnosData); // Verifica los datos
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
        } else {
          console.error("Formato inesperado de datos:", alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };
  
    cargarAlumnos();
  }, [idCurso]);
  
  
  

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  // Manejar cambios en el alumno seleccionado
  const handleAlumnoChange = (event, value) => {
    if (value) {
      setSelectedAlumno(value);
      setNewAnotacion({ ...newAnotacion, rut_alumno: value.rut_alumno });
    } else {
      setSelectedAlumno(null);
      setNewAnotacion({ ...newAnotacion, rut_alumno: '' });
    }
  };

  // Enviar la anotación al backend
  const handleSubmit = async () => {
    if (!newAnotacion.rut_alumno) {
      setMessage('Debe seleccionar un alumno.');
      return;
    }
    if (!newAnotacion.descripcion.trim()) {
      setMessage('La descripción no puede estar vacía.');
      return;
    }

    try {
      await createAnotacion(newAnotacion);
      setMessage('Anotación creada exitosamente');
      setNewAnotacion({
        tipo: 'Positiva',
        rut_alumno: '',
        descripcion: '',
        id_asignatura: idCurso || '',
        fecha: new Date().toISOString(),
      });
      setSelectedAlumno(null);
    } catch (error) {
      console.error('Error al crear la anotación:', error);
      setMessage('Hubo un error al crear la anotación');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Añadir Anotaciones
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
        <Select
          label="Tipo de Anotación"
          name="tipo"
          variant="outlined"
          fullWidth
          value={newAnotacion.tipo}
          onChange={handleSelectChange}
        >
          <MenuItem value="Positiva">Positiva</MenuItem>
          <MenuItem value="Negativa">Negativa</MenuItem>
        </Select>
        <Autocomplete
  options={alumnos || []} // Asegura que siempre sea un array
  getOptionLabel={(option) =>
    option.nombre && option.apellido
      ? `${option.nombre} ${option.apellido}`
      : 'Alumno sin nombre'
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Buscar Alumno"
      variant="outlined"
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  onChange={handleAlumnoChange}
  value={selectedAlumno}
  noOptionsText="No se encontraron alumnos"
  loading={loading}
/>


        <TextField
          label="Descripción"
          name="descripcion"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          value={newAnotacion.descripcion}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar Anotación
        </Button>
        {message && (
          <Typography
            color={message.includes('error') ? 'error.main' : 'success.main'}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Add_anotaciones;
