import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Modal, Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import useReservas from '../hooks/reservas/useReservas';
import useLabs from '../hooks/labs/useLabs'; // Importa el hook useLabs
import { useHorarios } from '../hooks/horarios/useHorarios'; // Importa el hook useHorarios
import TableReservas from '../components/TableReservas'; // Importa el componente TableReservas

const Reservas = () => {
  const { reservas, fetchReservas, addReserva, editReserva, removeReserva, error } = useReservas();
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
    id_asignatura: '',
    id_curso: ''
  });
  const [currentReserva, setCurrentReserva] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    fetchReservas();
    fetchLabs(); // Obtén los laboratorios cuando el componente se monte
    fetchHorarios(); // Obtén los horarios cuando el componente se monte
  }, []);


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

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <h1 className="text-4xl text-center text-blue-100 mb-4">Reservas</h1>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-between items-center mb-4">
        </div>

        <TableReservas
            reservas={reservas}
            handleOpen={handleEditOpen}
            handleDelete={handleDeleteOpen}
        />

    </div>
  );
};

export default Reservas;