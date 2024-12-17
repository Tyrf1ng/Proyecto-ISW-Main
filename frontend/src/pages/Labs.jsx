import { useEffect, useState } from 'react';
import useLabs from '../hooks/labs/useLabs';
import TableLabs from '../components/TableLabs';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';
import useAlert from "../hooks/useAlerts.jsx";
import { AnimatePresence } from "framer-motion";

const Labs = () => {
  const { labs = [], fetchLabs, addLab, editLab, removeLab } = useLabs();
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
  const [alert, showAlert] = useAlert();
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleOpen = () => {
    setValidationError(null);
    setNewLab({ nombre: '', capacidad: '' });
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

  const normalizeString = (str) => {
    return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const normalizeName = (name) => {
    return name.replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = async () => {
    const normalizedNombre = normalizeName(newLab.nombre);
    if (!newLab.nombre || !newLab.capacidad) {
      setValidationError('Todos los campos son obligatorios');
      return;
    }
    if (normalizedNombre.length < 10 || normalizedNombre.length > 40) {
      setValidationError('El nombre debe tener entre 10 y 40 caracteres');
      return;
    }
    if (!Number.isInteger(Number(newLab.capacidad)) || newLab.capacidad <= 4 || newLab.capacidad >= 100) {
      setValidationError('Capacidad debe ser un número entero mayor a 4 y menor a 100');
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
      showAlert('Laboratorio creado con éxito', 'success');
    } catch (error) {
      console.error("Error al crear el laboratorio: ", error);
      setValidationError(error.message || "Los valores ingresados no son válidos");
    }
  };

  const handleEditSubmit = async () => {
    const normalizedNombre = normalizeName(currentLab.nombre);
    if (!currentLab.nombre || !currentLab.capacidad) {
      setValidationError('Todos los campos son obligatorios');
      return;
    }
    if (normalizedNombre.length < 10 || normalizedNombre.length > 40) {
      setValidationError('El nombre debe tener entre 10 y 40 caracteres');
      return;
    }
    if (!Number.isInteger(Number(currentLab.capacidad)) || currentLab.capacidad <= 4 || currentLab.capacidad >= 100) {
      setValidationError('Capacidad debe ser un número entero mayor a 4 y menor a 100');
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
      showAlert('Laboratorio editado con éxito', 'success');
    } catch (error) {
      console.error("Error al actualizar el laboratorio: ", error);
      setValidationError(error.message || "Los valores ingresados no son válidos");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await removeLab(currentLab.id_lab);
      if (!response.success) {
        throw new Error(response.error || "Hubo un error al eliminar el laboratorio");
      }
      handleDeleteClose();
      fetchLabs();
      setDeleteSuccess(true);
      showAlert('Laboratorio eliminado con éxito', 'success');
    } catch (error) {
      console.error("Error al eliminar el laboratorio: ", error);
      showAlert(error.message || 'Hubo un error al eliminar el laboratorio', 'error');
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

  const sortedLabs = [...labs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl text-center font-semibold mb-4 text-gray-800 dark:text-white">Laboratorios</h1>
      <div className="flex justify-between items-center mb-2 mt-6">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar por nombre"
          className="mt-2 block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          style={{ maxWidth: '300px' }}
        />
        <button onClick={handleOpen} className="ml-4 h-10 px-4 py-2 bg-blue-600 text-white rounded">Crear Laboratorio</button>
      </div>

      <TableLabs
        labs={sortedLabs.filter((lab) =>
          normalizeString(lab.nombre).includes(normalizeString(filterText))
        )}
        handleOpen={handleEditOpen}
        handleDelete={handleDeleteOpen}
        handleSort={handleSort}
        sortConfig={sortConfig}
      />

      <AnimatePresence>
        {alert.type === "warning" && (
          <WarningAlert message={alert.message} key="warning" />
        )}
        {alert.type === "success" && (
          <SuccessAlert message={alert.message} key="success" />
        )}
        {alert.type === "error" && (
          <ErrorAlert message={alert.message} key="error" />
        )}
      </AnimatePresence>

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
              className="w-full p-2 mb-1 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Nombre"
              maxLength="40"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{newLab.nombre.length}/40</div>
            <input
              type="number"
              name="capacidad"
              value={newLab.capacidad}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Capacidad"
            />
            <div className="flex justify-between mt-4">
              <button onClick={handleSubmit} className="px-10 py-2 bg-blue-600 text-white rounded">Guardar</button>
              <button onClick={handleClose} className="px-10 py-2 bg-gray-400 text-white rounded">Cancelar</button>
            </div>
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
              className="w-full p-2 mb-1 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Nombre"
              maxLength="40"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{currentLab?.nombre.length || 0}/40</div>
            <input
              type="number"
              name="capacidad"
              value={currentLab?.capacidad || ''}
              onChange={handleEditInputChange}
              className="w-full p-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Capacidad"
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
            <p className="mb-4">¿Estás seguro de que deseas eliminar el laboratorio {currentLab?.nombre}?</p>
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

export default Labs;