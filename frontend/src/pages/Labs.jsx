import { useState } from 'react';
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
import useLabs from '@hooks/labs/useLabs';

const Labs = () => {
  const { labs = [], fetchLabs, addLab } = useLabs(); // Asegúrate de incluir addLab
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [newLab, setNewLab] = useState({
    nombre: '',
    capacidad: '',
  });

  // Filtrar los laboratorios por nombre
  const filteredLabs = Array.isArray(labs)
    ? labs.filter((lab) => lab.nombre.toLowerCase().includes(filterText.toLowerCase()))
    : [];

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLab({ ...newLab, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await addLab(newLab); // Usa addLab del hook useLabs
      handleClose();
    } catch (error) {
      console.error("Error al crear el laboratorio: ", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Laboratorios</Typography>
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
              <TableCell>Nombre</TableCell>
              <TableCell>Capacidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLabs.map((lab) => (
              <TableRow key={lab.id_lab}>
                <TableCell>{lab.nombre}</TableCell>
                <TableCell>{lab.capacidad}</TableCell>
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
    </Box>
  );
};

export default Labs;