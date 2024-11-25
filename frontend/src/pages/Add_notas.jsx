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
import { createNota } from '@services/notas.service.js';

function Add_Notas() {
  const { idCurso } = useContext(CursoContext); // Obtén el curso actual del contexto
  const [newNota, setNewNota] = useState({
    tipo: '',
    valor: '',
    rut_alumno: '',
    id_asignatura: idCurso || '',
  });
  const [message, setMessage] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar alumnos del curso actual
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error('ID del curso no válido:', idCurso);
        return;
      }
      setLoading(true);
      try {
        const alumnosData = await getAlumnosByCurso(idCurso);
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
        } else {
          console.error('Formato inesperado de datos:', alumnosData);
        }
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarAlumnos();
  }, [idCurso]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNota({ ...newNota, [name]: value });
  };

  const handleAlumnoChange = (event, value) => {
    if (value) {
      setSelectedAlumno(value);
      setNewNota({ ...newNota, rut_alumno: value.rut });
    } else {
      setSelectedAlumno(null);
      setNewNota({ ...newNota, rut_alumno: '' });
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!newNota.rut_alumno || !newNota.tipo || !newNota.valor) {
      setMessage('Debe completar todos los campos.');
      return;
    }

    try {
      await createNota(newNota);
      setMessage('Nota creada exitosamente.');
      setNewNota({
        tipo: '',
        valor: '',
        rut_alumno: '',
        id_asignatura: idCurso || '',
      });
      setSelectedAlumno(null);
    } catch (error) {
      console.error('Error al crear la nota:', error);
      setMessage('Hubo un error al crear la nota.');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Añadir Notas
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
        <Select
          name="tipo"
          value={newNota.tipo}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Seleccionar tipo de nota
          </MenuItem>
          <MenuItem value="Prueba">Prueba</MenuItem>
          <MenuItem value="Tarea">Tarea</MenuItem>
          <MenuItem value="Presentacion">Presentacion</MenuItem>
        </Select>

        <TextField
          label="Valor de la Nota (1.0-7.0)"
          name="valor"
          type="number"
          value={newNota.valor}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          inputProps={{ min: 1.0, max: 7.0, step: 0.1 }}
        />

        <Autocomplete
          options={alumnos}
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
        />

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar Nota
        </Button>

        {message && (
          <Typography
            align="center"
            color={message.includes('error') ? 'error.main' : 'success.main'}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Add_Notas;
