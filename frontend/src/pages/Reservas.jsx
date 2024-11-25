import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Modal, Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import useReservas from '../hooks/reservas/useReservas';
import useLabs from '../hooks/labs/useLabs'; // Importa el hook useLabs
import { useHorarios } from '../hooks/horarios/useHorarios'; // Importa el hook useHorarios

const Reservas = () => {
  const { reservas = [], fetchReservas, addReserva, editReserva, removeReserva, error } = useReservas();
  const { labs: laboratorios, fetchLabs } = useLabs(); // Usa el hook useLabs
  const { horarios, fetchHorarios } = useHorarios(); // Usa el hook useHorarios
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newReserva, setNewReserva] = useState({
    id_lab: '',
    rut_docente: '',
    fecha: '',
    id_horario: '',
  });
  const [currentReserva, setCurrentReserva] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'asc' });

  useEffect(() => {
    fetchReservas();
    fetchLabs(); // Obtén los laboratorios cuando el componente se monte
    fetchHorarios(); // Obtén los horarios cuando el componente se monte
  }, []);

  const filteredReservas = Array.isArray(reservas)
    ? reservas.filter((reserva) => reserva.fecha && reserva.fecha.toLowerCase().includes(filterText.toLowerCase()))
    : [];

  const sortedReservas = filteredReservas.sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'fecha') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
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
  const handleEditOpen = (reserva) => {
    setCurrentReserva(reserva);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);
  const handleDeleteOpen = (reserva) => {
    setCurrentReserva(reserva);
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReserva({ ...newReserva, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReserva({ ...currentReserva, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addReserva(newReserva);
      handleClose();
      fetchReservas();
      setCreateSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al crear la reserva: ", error);
      setValidationError("Los valores ingresados no son válidos");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await editReserva(currentReserva.id_reserva, currentReserva);
      handleEditClose();
      fetchReservas();
      setEditSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al actualizar la reserva: ", error);
      setValidationError("Los valores ingresados no son válidos");
    }
  };

  const handleDelete = async () => {
    try {
      await removeReserva(currentReserva.id_reserva);
      handleDeleteClose();
      fetchReservas();
      setDeleteSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      setDeleteError("No se puede borrar la reserva.");
      console.error("Error al eliminar la reserva: ", error);
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
      <Typography variant="h4"   gutterBottom align="center">Reservas</Typography>
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
          Reserva eliminada con éxito
        </Alert>
      </Snackbar>
      <Snackbar
        open={createSuccess}
        autoHideDuration={6000}
        onClose={() => setCreateSuccess(false)}
      >
        <Alert onClose={() => setCreateSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Reserva creada con éxito
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
          label="Filtrar por fecha"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Reserva
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Laboratorio</TableCell>
              <TableCell>Docente</TableCell>
              <TableCell>
                Fecha
                <IconButton size="small" onClick={() => handleSort('fecha')}>
                  {sortConfig.key === 'fecha' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </TableCell>
              <TableCell>Horario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedReservas.map((reserva) => (
              <TableRow key={reserva.id_reserva}>
                <TableCell>{reserva.laboratorio}</TableCell>
                <TableCell>{reserva.docente}</TableCell>
                <TableCell>{reserva.fecha}</TableCell>
                <TableCell>{reserva.horario}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditOpen(reserva)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOpen(reserva)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear una nueva reserva */}
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
          <Typography variant="h6" gutterBottom>Crear Nueva Reserva</Typography>
          <FormControl fullWidth margin="normal" sx={{ marginTop: 2 }}>
            <InputLabel>Laboratorio</InputLabel>
            <Select
              name="id_lab"
              value={newReserva.id_lab}
              onChange={handleInputChange}
              label="Laboratorio"
            >
              {laboratorios.map((lab) => (
                <MenuItem key={lab.id_lab} value={lab.id_lab}>
                  {lab.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="RUT Docente"
            name="rut_docente"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newReserva.rut_docente}
            onChange={handleInputChange}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Fecha"
            name="fecha"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newReserva.fecha}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginTop: 2 }}
          />
          <FormControl fullWidth margin="normal" sx={{ marginTop: 2 }}>
            <InputLabel>Horario</InputLabel>
            <Select
              name="id_horario"
              value={newReserva.id_horario}
              onChange={handleInputChange}
              label="Horario"
            >
              {horarios.map((horario) => (
                <MenuItem key={horario.id_horario} value={horario.id_horario}>
                  {horario.hora_inicio} - {horario.hora_fin}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
            Guardar
          </Button>
        </Box>
      </Modal>

      {/* Modal para editar una reserva */}
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
          <Typography variant="h6" gutterBottom>Editar Reserva</Typography>
          <FormControl fullWidth margin="normal" sx={{ marginTop: 2 }}>
            <InputLabel>Laboratorio</InputLabel>
            <Select
              name="id_lab"
              value={currentReserva?.id_lab || ''}
              onChange={handleEditInputChange}
              label="Laboratorio"
            >
              {laboratorios.map((lab) => (
                <MenuItem key={lab.id_lab} value={lab.id_lab}>
                  {lab.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="RUT Docente"
            name="rut_docente"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentReserva?.rut_docente || ''}
            onChange={handleEditInputChange}
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Fecha"
            name="fecha"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentReserva?.fecha || ''}
            onChange={handleEditInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginTop: 2 }}
          />
          <FormControl fullWidth margin="normal" sx={{ marginTop: 2 }}>
            <InputLabel>Horario</InputLabel>
            <Select
              name="id_horario"
              value={currentReserva?.id_horario || ''}
              onChange={handleEditInputChange}
              label="Horario"
            >
              {horarios.map((horario) => (
                <MenuItem key={horario.id_horario} value={horario.id_horario}>
                  {horario.hora_inicio} - {horario.hora_fin}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            ¿Estás seguro de que deseas eliminar la reserva del {currentReserva?.fecha}?
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

export default Reservas;