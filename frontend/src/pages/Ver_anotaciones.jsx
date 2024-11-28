import { useState, useContext } from 'react';
import { Box, Modal, IconButton, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; // Lo podemos eliminar si no se usa
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import TableComponent from '../components/Table';  // Importar el componente de la tabla
import { createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';
import { CursoContext } from '../context/CursoContext'; // Importa el contexto

const Ver_anotaciones = () => {
  const { idCurso } = useContext(CursoContext); // Usa el idCurso del contexto
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

  const filteredAnotaciones = anotaciones.filter((anotacion) =>
    anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

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
      fetchAnotaciones(); // Vuelve a cargar las anotaciones
      handleClose();
    } catch (error) {
      console.error("Error al guardar la anotación: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnotacion(id);
      fetchAnotaciones(); // Vuelve a cargar las anotaciones
    } catch (error) {
      console.error("Error al eliminar la anotación: ", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">

      <div className="flex justify-between items-center mb-4">
        <div className="w-full">
          <label htmlFor="filter" className="block text-sm text-gray-500 dark:text-gray-300">
            Filtrar por descripción
          </label>
          <input
            id="filter"
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Filtrar anotaciones..."
            className="block bg-gray-50 mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          />
        </div>
      </div>

      {/* Tabla de anotaciones */}
      <TableComponent 
        anotaciones={filteredAnotaciones} 
        handleOpen={handleOpen} 
        handleDelete={handleDelete} 
      />

      {/* Modal para crear o editar una anotación */}
      <Modal open={open} onClose={handleClose}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96">
          <Typography variant="h6" className="text-xl font-semibold mb-4">
            {editMode ? "Editar Anotación" : "Crear Nueva Anotación"}
          </Typography>

          <Select
            label="Tipo"
            name="tipo"
            value={newAnotacion.tipo}
            onChange={handleSelectChange}
            fullWidth
            className="mb-4"
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
            className="mb-4"
          />

          <TextField
            label="Descripción"
            name="descripcion"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newAnotacion.descripcion}
            onChange={handleInputChange}
            className="mb-4"
          />

          <TextField
            label="ID Asignatura"
            name="id_asignatura"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newAnotacion.id_asignatura}
            onChange={handleInputChange}
            className="mb-4"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="w-full"
          >
            {editMode ? "Actualizar" : "Guardar"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Ver_anotaciones;
