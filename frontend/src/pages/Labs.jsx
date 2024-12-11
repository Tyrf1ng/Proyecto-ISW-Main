import { useEffect, useState } from 'react';
import useLabs from '../hooks/labs/useLabs';
import TableLabs from '../components/TableLabs';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';

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
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleOpen = () => {
    setValidationError(null);
    setOpen(true);
  };
  const handleClose = () => {
    setValidationError(null);
    setOpen(false);
  };
  const handleEditOpen = (lab) => {
    setValidationError(null);
    setCurrentLab(lab);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setValidationError(null);
    setEditOpen(false);
  };
  const handleDeleteOpen = (lab) => {
    setCurrentLab(lab);
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLab({ ...newLab, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLab({ ...currentLab, [name]: value });
  };

  const normalizeName = (name) => {
    return name.replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = async () => {
    const normalizedNombre = normalizeName(newLab.nombre);
    if (!Number.isInteger(Number(newLab.capacidad)) || newLab.capacidad <= 0 || newLab.capacidad >= 100) {
        setValidationError('Capacidad debe ser un número entero mayor a 0 y menor a 100');
        return;
    }
    if (labs.some(lab => normalizeName(lab.nombre).toLowerCase() === normalizedNombre.toLowerCase())) {
        setValidationError('El nombre del laboratorio ya existe');
        return;
    }
    try {
        await addLab({ ...newLab, nombre: normalizedNombre });
        handleClose();
        fetchLabs();
        setCreateSuccess(true);
        setMessage('Laboratorio creado con éxito');
        setMessageType('success');
    } catch (error) {
        console.error("Error al crear el laboratorio: ", error);
        setValidationError(error.message || "Los valores ingresados no son válidos");
    }
  };

  const handleEditSubmit = async () => {
    const normalizedNombre = normalizeName(currentLab.nombre);
    if (!Number.isInteger(Number(currentLab.capacidad)) || currentLab.capacidad <= 0 || currentLab.capacidad >= 100) {
        setValidationError('Capacidad debe ser un número entero mayor a 0 y menor a 100');
        return;
    }
    if (labs.some(lab => normalizeName(lab.nombre).toLowerCase() === normalizedNombre.toLowerCase() && lab.id_lab !== currentLab.id_lab)) {
        setValidationError('El nombre del laboratorio ya existe');
        return;
    }
    try {
        await editLab({ ...currentLab, nombre: normalizedNombre });
        handleEditClose();
        fetchLabs();
        setEditSuccess(true);
        setMessage('Laboratorio editado con éxito');
        setMessageType('success');
    } catch (error) {
        console.error("Error al actualizar el laboratorio: ", error);
        setValidationError(error.message || "Los valores ingresados no son válidos");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await removeLab(currentLab.id_lab);
      if (response.error) {
        throw new Error(response.error);
      }
      handleDeleteClose();
      fetchLabs();
      setDeleteSuccess(true);
      setMessage('Laboratorio eliminado con éxito');
      setMessageType('success');
    } catch (error) {
      console.error("Error al eliminar el laboratorio: ", error);
      setMessage('Hubo un error al eliminar el laboratorio');
      setMessageType('error');
      setDeleteOpen(false);
      fetchLabs();
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    fetchLabs();
  }, []);


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
      <h1 className="text-4xl text-center text-blue-100 mb-4">Laboratorios</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleOpen} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded">Crear Laboratorio</button>
      </div>

      <TableLabs
        labs={labs.filter((lab) =>
          lab.nombre && lab.nombre.toLowerCase().includes(filterText.toLowerCase())
        )}
        handleOpen={handleEditOpen}
        handleDelete={handleDeleteOpen}
        handleSort={handleSort}
        sortConfig={sortConfig}
      />

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
          <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Crear Nuevo Laboratorio</h2>
            {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
            <input
              type="text"
              name="nombre"
              value={newLab.nombre}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Nombre"
            />
            <input
              type="number"
              name="capacidad"
              value={newLab.capacidad}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Capacidad"
            />
            <button onClick={handleSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleEditClose}>
          <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Editar Laboratorio</h2>
            {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
            <input
              type="text"
              name="nombre"
              value={currentLab?.nombre || ''}
              onChange={handleEditInputChange}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Nombre"
            />
            <input
              type="number"
              name="capacidad"
              value={currentLab?.capacidad || ''}
              onChange={handleEditInputChange}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Capacidad"
            />
            <button onClick={handleEditSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </div>
      )}

      {deleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteClose}>
          <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p className="mb-4">¿Estás seguro de que deseas eliminar el laboratorio {currentLab?.nombre}?</p>
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

export default Labs;