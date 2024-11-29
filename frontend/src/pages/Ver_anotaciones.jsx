import { useState, useContext, useEffect } from 'react';
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
    id_asignatura: idCurso || '',
    fecha: new Date().toISOString(),
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [anotacionToDelete, setAnotacionToDelete] = useState(null);

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  const handleOpenModal = (anotacion = null) => {
    setIsEditMode(!!anotacion);
    setCurrentAnotacion(anotacion);
    setNewAnotacion(anotacion || {
      tipo: 'Positiva',
      rut_alumno: '',
      descripcion: '',
      id_asignatura: idCurso || '',
      fecha: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

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
      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar anotaciones..."
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <TableComponent
        anotaciones={anotaciones.filter((a) =>
          a.descripcion.toLowerCase().includes(filterText.toLowerCase())
        )}
        handleOpen={handleOpenModal}
        handleDelete={handleDeleteRequest}
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 rounded-lg shadow-xl w-96 bg-white text-black dark:bg-[#111827] dark:text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? 'Editar Anotación' : 'Nueva Anotación'}
            </h2>
            <div className="mb-4">
              <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">Tipo de Anotación</label>
              <select
                name="tipo"
                id="tipo"
                value={newAnotacion.tipo}
                onChange={handleSelectChange}
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="Positiva">Positiva</option>
                <option value="Negativa">Negativa</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="rut_alumno" className="block text-sm text-gray-500 dark:text-gray-300">
                RUT del Alumno
              </label>
              <input
                type="text"
                id="rut_alumno"
                name="rut_alumno"
                value={newAnotacion.rut_alumno}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-sm text-gray-500 dark:text-gray-300">Descripción</label>
              <textarea
                name="descripcion"
                id="descripcion"
                value={newAnotacion.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción"
                rows="4"
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
                {isEditMode ? 'Actualizar' : 'Guardar'}
              </button>
              <button onClick={handleCloseModal} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white">
            <h2 className="text-2xl font-bold mb-4">¿Estás seguro de que quieres eliminar esta anotación?</h2>
            <div className="flex justify-around mt-6">
              <button onClick={handleConfirmDelete} className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg">
                Eliminar
              </button>
              <button onClick={() => setConfirmDialogOpen(false)} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">
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
