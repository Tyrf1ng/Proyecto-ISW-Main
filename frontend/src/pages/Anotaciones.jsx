import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import { createAnotacion } from '@services/anotaciones.service.js';

const Anotaciones = () => {
  const { anotaciones, fetchAnotaciones } = useAnotaciones();
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: '',
    rut_alumno: '',
    descripcion: '',
    id_asignatura: '',
    fecha: new Date().toISOString(),
  });

  // Filtrar las anotaciones por descripción
  const filteredAnotaciones = anotaciones.filter((anotacion) =>
    anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await createAnotacion(newAnotacion);
      fetchAnotaciones();
      handleClose();
    } catch (error) {
      console.error("Error al crear la anotación: ", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anotaciones
      </Typography>
      <TextField
        label="Filtrar por descripción"
        variant="outlined"
        value={filterText}
        onChange={handleFilterChange}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Crear Anotación
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>RUT del Alumno</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha de Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnotaciones.map((anotacion) => (
              <TableRow key={anotacion.id_anotacion}>
                <TableCell>{anotacion.tipo}</TableCell>
                <TableCell>{anotacion.rut_alumno}</TableCell>
                <TableCell>{anotacion.descripcion}</TableCell>
                <TableCell>{new Date(anotacion.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear una nueva anotación */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Crear Nueva Anotación
          </Typography>
          <TextField
            label="Tipo"
            name="tipo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAnotacion.tipo}
            onChange={handleInputChange}
          />
          <TextField
            label="RUT del Alumno"
            name="rut_alumno"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAnotacion.rut_alumno}
            onChange={handleInputChange}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAnotacion.descripcion}
            onChange={handleInputChange}
          />
          <TextField
            label="ID Asignatura"
            name="id_asignatura"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newAnotacion.id_asignatura}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

// Estilos para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default Anotaciones;
