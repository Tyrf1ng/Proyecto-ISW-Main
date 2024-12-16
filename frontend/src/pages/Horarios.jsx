import { useEffect, useState } from 'react';
import { useHorarios } from '@hooks/horarios/useHorarios';
import TableHorarios from '../components/TableHorarios';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';

const Horarios = () => {
    const { horarios = [], fetchHorarios, addHorario, editHorario, removeHorario, isHorarioValid, error } = useHorarios();
    const [filterText, setFilterText] = useState('');
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [newHorario, setNewHorario] = useState({
        hora_inicio: '',
        hora_fin: '',
    });
    const [currentHorario, setCurrentHorario] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [editSuccess, setEditSuccess] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleFilterChange = (e) => setFilterText(e.target.value);
    const handleOpen = () => {
        setValidationError(null);
        setOpen(true);
    };
    const handleClose = () => {
        setValidationError(null);
        setOpen(false);
    };
    const handleEditOpen = (horario) => {
        setValidationError(null);
        setCurrentHorario(horario);
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setValidationError(null);
        setEditOpen(false);
    };
    const handleDeleteOpen = (horario) => {
        setCurrentHorario(horario);
        setDeleteOpen(true);
    };
    const handleDeleteClose = () => setDeleteOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHorario({ ...newHorario, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentHorario({ ...currentHorario, [name]: value });
    };

    const handleSubmit = async () => {
        if (!newHorario.hora_inicio || !newHorario.hora_fin) {
            setValidationError("Todos los campos son obligatorios");
            return;
        }
        if (newHorario.hora_inicio >= newHorario.hora_fin) {
            setValidationError("La hora de inicio debe ser menor que la hora de fin");
            return;
        }
        if (newHorario.hora_inicio < "08:00" || newHorario.hora_fin > "22:00") {
            setValidationError("Las horas deben estar entre las 08:00 y las 22:00");
            return;
        }
        if (!isHorarioValid(newHorario.hora_inicio, newHorario.hora_fin)) {
            setValidationError("El horario se solapa con otro existente o tiene horas de inicio/fin duplicadas");
            return;
        }
        await addHorario(newHorario);
        setCreateSuccess(true);
        setOpen(false);
        setNewHorario({ hora_inicio: '', hora_fin: '' });
        fetchHorarios();
        setMessage('Horario creado con éxito');
        setMessageType('success');
    };

    const handleEditSubmit = async () => {
        if (!currentHorario.hora_inicio || !currentHorario.hora_fin) {
            setValidationError("Todos los campos son obligatorios");
            return;
        }
        if (currentHorario.hora_inicio >= currentHorario.hora_fin) {
            setValidationError("La hora de inicio debe ser menor que la hora de fin");
            return;
        }
        if (currentHorario.hora_inicio < "08:00" || currentHorario.hora_fin > "22:00") {
            setValidationError("Las horas deben estar entre las 08:00 y las 22:00");
            return;
        }
        if (!isHorarioValid(currentHorario.hora_inicio, currentHorario.hora_fin, currentHorario.id_horario)) {
            setValidationError("El horario se solapa con otro existente o tiene horas de inicio/fin duplicadas");
            return;
        }
        await editHorario(currentHorario);
        setEditSuccess(true);
        setEditOpen(false);
        fetchHorarios();
        setMessage('Horario editado con éxito');
        setMessageType('success');
    };

    const handleDelete = async () => {
        if (!currentHorario || !currentHorario.id_horario) {
            setDeleteError("ID de horario no válido");
            return;
        }
        try {
            const response = await removeHorario(currentHorario.id_horario);
            if (response.error) {
                throw new Error(response.error);
            }
            setDeleteSuccess(true);
            setDeleteOpen(false);
            fetchHorarios();
            setMessage('Horario eliminado con éxito');
            setMessageType('success');
        } catch (error) {
            console.error('Error al eliminar el horario:', error);
            setMessage('Hubo un error al eliminar el horario');
            setMessageType('error');
            setDeleteOpen(false);
            fetchHorarios(); 
        }
    };

    useEffect(() => {
        fetchHorarios();
    }, []);

    useEffect(() => {
        if (message) {
          const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 3000);
          return () => clearTimeout(timer);
        }
      }, [message]);

    const renderMessage = () => {
        if (messageType === 'success') {
            return <SuccessAlert message={message} />;
        }

        if (messageType === 'error') {
            return <ErrorAlert message={message} />;
        }

        return null;
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
            <h1 className="text-4xl text-center font-semibold text-blue-100 mb-4">Horarios</h1>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleOpen} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded">Crear Horario</button>
            </div>

            <TableHorarios
                horarios={horarios.filter((h) =>
                    h.hora_inicio && h.hora_inicio.toLowerCase().includes(filterText.toLowerCase())
                )}
                handleOpen={handleEditOpen}
                handleDelete={handleDeleteOpen}
            />

            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
                    <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Crear Nuevo Horario</h2>
                        {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
                        <input
                            type="time"
                            name="hora_inicio"
                            value={newHorario.hora_inicio}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="time"
                            name="hora_fin"
                            value={newHorario.hora_fin}
                            onChange={handleInputChange}
                            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <button onClick={handleSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                    </div>
                </div>
            )}

            {editOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleEditClose}>
                    <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Editar Horario</h2>
                        {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
                        <input
                            type="time"
                            name="hora_inicio"
                            value={currentHorario?.hora_inicio || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="time"
                            name="hora_fin"
                            value={currentHorario?.hora_fin || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={handleEditSubmit} className="px-10 py-2 bg-blue-600 text-white rounded">Guardar</button>
                            <button onClick={handleEditClose} className="px-10 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                    </div>
                    </div>
                </div>
            )}

            {deleteOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteClose}>
                    <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
                        <p className="mb-4">¿Estás seguro de que deseas eliminar el horario {currentHorario?.hora_inicio} - {currentHorario?.hora_fin}?</p>
                        <div className="flex justify-around">
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Confirmar</button>
                            <button onClick={handleDeleteClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {renderMessage()}
        </div>
    );
};

export default Horarios;