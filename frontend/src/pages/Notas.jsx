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
import useNotas from '@hooks/notas/useNotas';
import { createNota } from '@services/notas.service.js';

const Notas = () => {
  const { notas = [], fetchNotas } = useNotas(); // Asegura que `notas` sea un array
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [newNota, setNewNota] = useState({
    tipo: '',
    rut_alumno: '',
    valor: '',
    id_asignatura: '',
  });

  // Filtrar las notas por descripción
  const filteredNotas = Array.isArray(notas)
    ? notas.filter((nota) => nota.tipo.toLowerCase().includes(filterText.toLowerCase()))
    : [];

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNota({ ...newNota, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await createNota(newNota);
      fetchNotas();
      handleClose();
    } catch (error) {
      console.error("Error al crear la nota: ", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Notas</Typography>
      <TextField
        label="Filtrar por asignatura"
        variant="outlined"
        value={filterText}
        onChange={handleFilterChange}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 2 }}>
        Crear Nota
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>RUT del Alumno</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Asignatura</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotas.map((nota) => (
              <TableRow key={nota.id_nota}>
                <TableCell>{nota.tipo}</TableCell>
                <TableCell>{nota.rut_alumno}</TableCell>
                <TableCell>{nota.valor}</TableCell>
                <TableCell>{nota.nombre_asignatura}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear una nueva nota */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ width: 400, padding: 3 }}>
          <Typography variant="h6" gutterBottom>Crear Nueva Nota</Typography>
          <TextField
            label="Tipo"
            name="tipo"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newNota.tipo}
            onChange={handleInputChange}
          />
          <TextField
            label="RUT del Alumno"
            name="rut_alumno"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newNota.rut_alumno}
            onChange={handleInputChange}
          />
          <TextField
            label="Valor"
            name="valor"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newNota.valor}
            onChange={handleInputChange}
          />
          <TextField
            label="ID Asignatura"
            name="id_asignatura"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newNota.id_asignatura}
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

export default Notas;
