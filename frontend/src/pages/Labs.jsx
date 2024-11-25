import React, { useState } from 'react';
import { Box, Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Modal, Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import useLabs from '../hooks/labs/useLabs'; // Asegúrate de que la ruta sea correcta

const Labs = () => {
  const { labs = [], fetchLabs, addLab, editLab, removeLab, error } = useLabs();
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newLab, setNewLab] = useState({
    nombre: '',
    capacidad: '',
  });
  const [currentLab, setCurrentLab] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });

  const filteredLabs = Array.isArray(labs)
    ? labs.filter((lab) => lab.nombre && lab.nombre.toLowerCase().includes(filterText.toLowerCase()))
    : [];

  const sortedLabs = filteredLabs.sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'nombre') {
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();
    } else if (sortConfig.key === 'capacidad') {
      aValue = parseInt(aValue, 10);
      bValue = parseInt(bValue, 10);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = (lab) => {
    setCurrentLab(lab);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleDeleteOpen = (lab) => {
    setCurrentLab(lab);
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'capacidad' && value !== '' && !/^\d+$/.test(value)) {
      setValidationError('Capacidad debe ser un número entero');
    } else {
      setValidationError(null);
    }
    setNewLab({ ...newLab, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'capacidad' && value !== '' && !/^\d+$/.test(value)) {
      setValidationError('Capacidad debe ser un número entero');
    } else {
      setValidationError(null);
    }
    setCurrentLab({ ...currentLab, [name]: value });
  };

  const handleSubmit = async () => {
    if (validationError) {
      return;
    }
    try {
      await addLab(newLab);
      handleClose();
      fetchLabs();
      setCreateSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al crear el laboratorio: ", error);
      setValidationError("Los valores ingresados no son válidos");
    }
  };

  const handleEditSubmit = async () => {
    if (validationError) {
      return;
    }
    try {
      await editLab(currentLab);
      handleEditClose();
      fetchLabs();
      setEditSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar el laboratorio: ", error);
      setValidationError("Los valores ingresados no son válidos");
    }
  };

  const handleDelete = async () => {
    try {
      await removeLab(currentLab.id_lab);
      handleDeleteClose();
      fetchLabs();
      setDeleteSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      setDeleteError("No se puede borrar el laboratorio porque está siendo utilizado en una reserva.");
      console.error("Error al eliminar el laboratorio: ", error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4"  gutterBottom align="center">Laboratorios</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Snackbar
        open={!!deleteError}
        autoHideDuration={6000}
        onClose={() => setDeleteError(null)}
      >
        <Alert onClose={() => setDeleteError(null)} severity="error" sx={{ width: '100%' }}>
          {deleteError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={editSuccess}
        autoHideDuration={6000}
        onClose={() => setEditSuccess(false)}
      >
        <Alert onClose={() => setEditSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Cambios realizados
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={6000}
        onClose={() => setDeleteSuccess(false)}
      >
        <Alert onClose={() => setDeleteSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Laboratorio eliminado con éxito
        </Alert>
      </Snackbar>
      <Snackbar
        open={createSuccess}
        autoHideDuration={6000}
        onClose={() => setCreateSuccess(false)}
      >
        <Alert onClose={() => setCreateSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Laboratorio creado con éxito
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!validationError}
        autoHideDuration={6000}
        onClose={() => setValidationError(null)}
      >
        <Alert onClose={() => setValidationError(null)} severity="error" sx={{ width: '100%' }}>
          {validationError}
        </Alert>
      </Snackbar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Filtrar por nombre"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Laboratorio
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Nombre
                <IconButton size="small" onClick={() => handleSort('nombre')}>
                  {sortConfig.key === 'nombre' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </TableCell>
              <TableCell>
                Capacidad
                <IconButton size="small" onClick={() => handleSort('capacidad')}>
                  {sortConfig.key === 'capacidad' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLabs.map((lab) => (
              <TableRow key={lab.id_lab}>
                <TableCell>{lab.nombre}</TableCell>
                <TableCell>{lab.capacidad}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditOpen(lab)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOpen(lab)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear un nuevo laboratorio */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Crear Nuevo Laboratorio</Typography>
          <TextField
            label="Nombre"
            name="nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newLab.nombre}
            onChange={handleInputChange}
          />
          <TextField
            label="Capacidad"
            name="capacidad"
            type="number" // Solo permite números
            variant="outlined"
            fullWidth
            margin="normal"
            value={newLab.capacidad}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
            Guardar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar un laboratorio */}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>Editar Laboratorio</Typography>
          <TextField
            label="Nombre"
            name="nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentLab?.nombre || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            label="Capacidad"
            name="capacidad"
            type="number" // Solo permite números
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentLab?.capacidad || ''}
            onChange={handleEditInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleEditSubmit} sx={{ marginTop: 2 }}>
            Guardar
          </Button>
        </Box>
      </Modal>

      {/* Dialogo para confirmar eliminación */}
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el laboratorio {currentLab?.nombre}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Labs;