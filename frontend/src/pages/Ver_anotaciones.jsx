import { useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete'; // Icono del basurero
import { CursoContext } from '../context/CursoContext';
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import { createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';
import TableComponent from '../components/Table';

const Ver_anotaciones = () => {
  const { idCurso } = useContext(CursoContext);
  const { anotaciones, fetchAnotaciones } = useAnotaciones();
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAnotacion, setCurrentAnotacion] = useState(null);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut_alumno: '',
    descripcion: '',
    id_asignatura: '',
    fecha: new Date().toISOString(),
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [anotacionToDelete, setAnotacionToDelete] = useState(null);

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleOpenModal = (anotacion = null) => {
    setIsEditMode(!!anotacion);
    setCurrentAnotacion(anotacion);
    setNewAnotacion(anotacion || {
      tipo: 'Positiva',
      rut_alumno: '',
      descripcion: '',
      id_asignatura: '',
      fecha: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateAnotacion(currentAnotacion.id_anotacion, newAnotacion);
      } else {
        await createAnotacion(newAnotacion);
      }
      fetchAnotaciones();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la anotación:', error);
    }
  };

  const handleDeleteRequest = (id) => {
    setAnotacionToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAnotacion(anotacionToDelete);
      fetchAnotaciones();
    } catch (error) {
      console.error('Error al eliminar la anotación:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <input
        type="text"
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Filtrar anotaciones..."
        className="w-full p-2 mb-4 border rounded"
      />

      <TableComponent
        anotaciones={anotaciones.filter((a) =>
          a.descripcion.toLowerCase().includes(filterText.toLowerCase())
        )}
        handleOpen={handleOpenModal}
        handleDelete={handleDeleteRequest}
      />

      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-lg font-bold">
                ¿Estás seguro de que quieres eliminar esta anotación?
              </h2>
            </div>
            <p className="text-base mb-6 mt-6">
              Esta acción no se puede deshacer. Confirma tu decisión.
            </p>
            <div className="flex justify-around mt-6">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ver_anotaciones;
