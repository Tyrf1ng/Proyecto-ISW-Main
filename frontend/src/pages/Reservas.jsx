import { useEffect, useState } from 'react';
import useReservas from '../hooks/reservas/useReservas';
import useLabs from '../hooks/labs/useLabs'; 
import { useHorarios } from '../hooks/horarios/useHorarios'; 
import TableReservas from '../components/TableReservas'; 
import { getCurso } from '@services/cursos.service.js'; 
import { getNombreAsignaturaById } from '@services/asignatura.service.js'; 

const Reservas = () => {
  const { reservas, fetchReservas, addReserva, editReserva, removeReserva, error } = useReservas();
  const { labs: laboratorios, fetchLabs } = useLabs();
  const { horarios, fetchHorarios } = useHorarios(); 
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newReserva, setNewReserva] = useState({
    id_lab: '',
    rut: '',
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
  const [reservasConNombre, setReservasConNombre] = useState([]);

  useEffect(() => {
    fetchReservas();
    fetchLabs(); 
    fetchHorarios(); 
  }, []);

  useEffect(() => {
    if (reservas.length > 0) {
      mapReservasConNombre();
    }
  }, [reservas]);

  const fetchNombreAsignatura = async (id_asignatura) => {
    try {
      const nombreAsignatura = await getNombreAsignaturaById(id_asignatura);
      return nombreAsignatura;
    } catch (error) {
      console.error("Error al obtener el nombre de la asignatura: ", error);
      return id_asignatura; 
    }
  };

  const mapReservasConNombre = async () => {
    const reservasMapeadas = await Promise.all(reservas.map(async reserva => {
      const nombreCurso = await getCurso(reserva.id_curso);
      const nombreAsignatura = await fetchNombreAsignatura(reserva.id_asignatura);
      const reservaConNombre = { 
        ...reserva, 
        nombre_curso: nombreCurso ? nombreCurso.nombre : reserva.id_curso,
        nombre_asignatura: nombreAsignatura
      };
      return reservaConNombre;
    }));
    setReservasConNombre(reservasMapeadas);
  };

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (reserva) => {
    setCurrentReserva(reserva);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleDeleteOpen = (reserva) => {
    setCurrentReserva({
        ...reserva,
        nombre_profesor: reserva.usuario,
        fecha: reserva.fecha,
        horario: reserva.horario
    });
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
      setCreateSuccess(true); 
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
      setEditSuccess(true); 
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
      setDeleteSuccess(true); 
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
            reservas={reservasConNombre}
            handleOpen={handleEditOpen}
            handleDelete={handleDeleteOpen}
        />

        {editOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleEditClose}>
                <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold mb-4">Editar Reserva</h2>
                    {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
                    <input
                        name="rut"
                        value={currentReserva?.usuario || ''}
                        onChange={handleEditInputChange}
                        placeholder="RUT"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        name="fecha"
                        type="date"
                        value={currentReserva?.fecha || ''}
                        onChange={handleEditInputChange}
                        placeholder="Fecha"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        name="id_horario"
                        value={currentReserva?.horario || ''}
                        onChange={handleEditInputChange}
                        placeholder="ID Horario"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        name="id_lab"
                        value={currentReserva?.laboratorio || ''}
                        onChange={handleEditInputChange}
                        placeholder="ID Laboratorio"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        name="id_asignatura"
                        value={currentReserva?.nombre_asignatura || ''}
                        onChange={handleEditInputChange}
                        placeholder="ID Asignatura"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        name="id_curso"
                        value={currentReserva?.nombre_curso || ''}
                        onChange={handleEditInputChange}
                        placeholder="ID Curso"
                        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <button onClick={handleEditSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                </div>
            </div>
        )}

        {deleteOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteClose}>
                <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
                    <p className="mb-4">
                      ¿Estás seguro de que deseas eliminar la reserva del profesor "{currentReserva?.usuario}" con
                      fecha "{currentReserva?.fecha}" en el horario "{currentReserva?.horario}"?
                    </p>
                    <div className="flex justify-around">
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Confirmar</button>
                        <button onClick={handleDeleteClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default Reservas;