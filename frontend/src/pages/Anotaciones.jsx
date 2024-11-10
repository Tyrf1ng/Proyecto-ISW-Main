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
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import { createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';

const Anotaciones = () => {
  const { anotaciones, fetchAnotaciones } = useAnotaciones();
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAnotacion, setCurrentAnotacion] = useState(null);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut_alumno: '',
    descripcion: '',
    id_asignatura: '',
    fecha: new Date().toISOString(),
  });

  // Verificar que anotaciones sea un array, de lo contrario usar un array vacío
  const filteredAnotaciones = Array.isArray(anotaciones)
    ? anotaciones.filter((anotacion) =>
        anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleOpen = (anotacion = null) => {
    if (anotacion) {
      setEditMode(true);
      setCurrentAnotacion(anotacion);
      setNewAnotacion(anotacion);
    } else {
      setEditMode(false);
      setNewAnotacion({
        tipo: 'Positiva',
        rut_alumno: '',
        descripcion: '',
        id_asignatura: '',
        fecha: new Date().toISOString(),
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateAnotacion(currentAnotacion.id_anotacion, newAnotacion);
      } else {
        await createAnotacion(newAnotacion);
      }
      fetchAnotaciones();
      handleClose();
    } catch (error) {
      console.error("Error al guardar la anotación: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnotacion(id);
      fetchAnotaciones();
    } catch (error) {
      console.error("Error al eliminar la anotación: ", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Anotaciones
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Filtrar por descripción"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Crear Anotación
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>RUT del Alumno</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnotaciones.length > 0 ? (
              filteredAnotaciones.map((anotacion) => (
                <TableRow key={anotacion.id_anotacion}>
                  <TableCell>{anotacion.tipo}</TableCell>
                  <TableCell>{anotacion.rut_alumno}</TableCell>
                  <TableCell sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                    {anotacion.descripcion}
                  </TableCell>
                  <TableCell>{new Date(anotacion.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(anotacion)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(anotacion.id_anotacion)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  El alumno de momento no posee anotaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear o editar una anotación */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? "Editar Anotación" : "Crear Nueva Anotación"}
          </Typography>
          <Select
            label="Tipo"
            name="tipo"
            variant="outlined"
            fullWidth
            value={newAnotacion.tipo}
            onChange={handleSelectChange}
          >
            <MenuItem value="Positiva">Positiva</MenuItem>
            <MenuItem value="Negativa">Negativa</MenuItem>
          </Select>
          <TextField
            label="RUT del Alumno"
            name="rut_alumno"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newAnotacion.rut_alumno}
            onChange={handleInputChange}
          />
          <TextField
            label="Descripción"
            name="descripcion"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newAnotacion.descripcion}
            onChange={handleInputChange}
          />
          <TextField
            label="ID Asignatura"
            name="id_asignatura"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newAnotacion.id_asignatura}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
            {editMode ? "Actualizar" : "Guardar"}
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
