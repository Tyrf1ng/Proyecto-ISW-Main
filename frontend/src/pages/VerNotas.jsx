import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import useNotasCurso from '@hooks/notas/useNotas';
import { deleteNota, updateNota } from '@services/notas.service';
import { CursoContext } from '@context/CursoContext';

const VerNotas = () => {
  const { idCurso } = useContext(CursoContext); 
  const { notas, fetchNotas } = useNotasCurso(idCurso); 
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNota, setCurrentNota] = useState(null);
  const [newNota, setNewNota] = useState({
    tipo: '',
    valor: '',
    rut_alumno: '',
    nombre_alumno: '',
    apellido_alumno: '',
    id_asignatura: '',
  });

  const filteredNotas = notas.filter((nota) =>
    `${nota.nombre_alumno.toLowerCase()} ${nota.apellido_alumno.toLowerCase()}`.includes(filterText.toLowerCase())
  );


  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  useEffect(() => {
    if (idCurso) fetchNotas();
  }, [idCurso, fetchNotas]);

  const handleOpen = (nota = null) => {
    if (nota) {
      setEditMode(true);
      setCurrentNota(nota);
      setNewNota(nota);
    } else {
      setEditMode(false);
      setNewNota({
        tipo: '',
        valor: '',
        rut_alumno: '',
        nombre_alumno: '',
        apellido_alumno: '',
        id_asignatura: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'valor') {
        setNewNota({ ...newNota, [name]: parseFloat(value) });
    } else {
        setNewNota({ ...newNota, [name]: value });
    }
};

  const handleSubmit = async () => {
    try {
        if (editMode) {
            // Asegúrate de que 'newNota.valor' sea un número
            await updateNota(currentNota.id_nota, newNota.valor);
        } else {
            console.warn("Funcionalidad de creación no implementada en este componente.");
        }
        fetchNotas();
        handleClose();
    } catch (error) {
        console.error("Error al guardar la nota: ", error);
    }
};


  const handleDelete = async (id) => {
    try {
      await deleteNota(id);
      fetchNotas();
    } catch (error) {
      console.error("Error al eliminar la nota: ", error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notas del Curso {idCurso ? `: ${idCurso}` : ''}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Filtrar por Nombre del Alumno"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Alumno</TableCell>
              <TableCell>Asignatura</TableCell>
              <TableCell>ID Asignatura</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotas.map((nota) => (
              <TableRow key={nota.id_nota}>
                <TableCell>{nota.tipo}</TableCell>
                <TableCell>{nota.valor}</TableCell>
                <TableCell>{nota.rut_alumno}</TableCell>
                <TableCell>{nota.nombre_alumno} {nota.apellido_alumno}</TableCell>
                <TableCell>{nota.nombre_asignatura}</TableCell>
                <TableCell>{nota.id_asignatura}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(nota)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(nota.id_nota)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? "Editar Nota" : "Crear Nueva Nota"}
          </Typography>
          <TextField
            label="Tipo"
            name="tipo"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newNota.tipo}
            onChange={handleInputChange}
          />
          <TextField
            label="Valor"
            name="valor"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newNota.valor}
            onChange={handleInputChange}
          />
          <TextField
            label="RUT"
            name="rut_alumno"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newNota.rut_alumno}
            onChange={handleInputChange}
          />
          <TextField
            label="ID Asignatura"
            name="id_asignatura"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newNota.id_asignatura}
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default VerNotas;
