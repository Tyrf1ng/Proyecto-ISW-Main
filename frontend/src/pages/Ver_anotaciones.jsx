import { useState } from 'react';
import useAnotaciones from '../hooks/anotaciones/useAnotaciones';
import useModal from '../hooks/anotaciones/useModal';
import useConfirmDialog from '../hooks/anotaciones/useConfirm';
import TableAnotacionComponent from '../components/Table';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';
import TituloAnotaciones from '../components/TituloAnotaciones';

const Ver_anotaciones = () => {
  const {
    anotaciones,
    loading: anotacionesLoading,
    addAnotacion,
    editAnotacion,
    removeAnotacion,
    alert,
    usuario,
    usuarioLoading,
    setAlert,
  } = useAnotaciones();

  const { isModalOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, itemId: anotacionToDelete, openConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAnotacion, setCurrentAnotacion] = useState(null);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    descripcion: '',
    idAsignatura: '',
    createdAt: new Date().toLocaleDateString('en-CA'),
  });
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [descripcionError, setDescripcionError] = useState('');

  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear}-03-01`;
  const maxDate = `${currentYear}-12-31`;

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const selectedYear = new Date(selectedDate).getFullYear();
      if (selectedYear !== currentYear) {
        setAlert({ message: `Solo puedes filtrar por fechas del año ${currentYear}.`, type: 'warning' });
        setFilterDate('');
        return;
      }
    }
    setFilterDate(selectedDate);
  };

  const handleOpenModal = (anotacion = null) => {
    setIsEditMode(!!anotacion);
    setCurrentAnotacion(anotacion);
    setDescripcionError('');

    if (anotacion) {
      setNewAnotacion({
        tipo: anotacion.tipo,
        descripcion: anotacion.descripcion,
        idAsignatura: anotacion.idAsignatura,
        createdAt: anotacion.createdAt,
      });
    } else {
      setNewAnotacion({
        tipo: 'Positiva',
        descripcion: '',
        idAsignatura: '',
        createdAt: new Date().toLocaleDateString('en-CA'),
      });
    }

    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setIsEditMode(false);
    setCurrentAnotacion(null);
    setNewAnotacion({
      tipo: 'Positiva',
      descripcion: '',
      idAsignatura: '',
      createdAt: new Date().toLocaleDateString('en-CA'),
    });
    setDescripcionError('');
  };

  const handleSubmit = async () => {
    if (newAnotacion.descripcion.trim().length < 5) {
      setDescripcionError('La descripción debe tener al menos 5 caracteres.');
      return;
    } else {
      setDescripcionError('');
    }

    try {
      if (isEditMode && currentAnotacion) {
        await editAnotacion(currentAnotacion.id_anotacion, newAnotacion);
      } else {
        await addAnotacion(newAnotacion);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la anotación:', error);
      setAlert({ message: 'Hubo un error al guardar la anotación.', type: 'error' });
    }
  };

  const handleDeleteRequest = (id) => {
    openConfirmDialog(id);
  };

  const handleConfirmDelete = async () => {
    if (anotacionToDelete) {
      await removeAnotacion(anotacionToDelete);
      closeConfirmDialog();
    }
  };

  const filterAnotaciones = (anotaciones) => {
    const filterDateFormatted = filterDate || null;

    return anotaciones.filter((anotacion) => {
      const anotacionDate = anotacion.createdAt ? new Date(anotacion.createdAt) : null;
      const anotacionYear = anotacionDate ? anotacionDate.getFullYear() : null;

      if (anotacionYear !== currentYear) {
        return false;
      }

      const anotacionDateFormatted = anotacionDate
        ? anotacionDate.toLocaleDateString('en-CA')
        : null;
      const descriptionMatch = anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase());
      const dateMatch = filterDateFormatted ? anotacionDateFormatted === filterDateFormatted : true;

      return descriptionMatch && dateMatch;
    });
  };

  const countAnotacionesTipo = (anotaciones) => {
    let positivas = 0;
    let negativas = 0;

    anotaciones.forEach((anotacion) => {
      if (anotacion.tipo === 'Positiva') {
        positivas++;
      } else if (anotacion.tipo === 'Negativa') {
        negativas++;
      }
    });

    return { positivas, negativas };
  };

  const filteredAnotaciones = filterAnotaciones(anotaciones);
  const { positivas, negativas } = countAnotacionesTipo(filteredAnotaciones);

  const data = [
    { name: 'Positivas', value: positivas },
    { name: 'Negativas', value: negativas },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  if (anotacionesLoading || usuarioLoading) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <TituloAnotaciones />
      {alert.message && alert.type === 'success' && <SuccessAlert message={alert.message} />}
      {alert.message && alert.type === 'error' && <ErrorAlert message={alert.message} />}
      {alert.message && alert.type === 'warning' && <WarningAlert message={alert.message} />}

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <div className="flex mb-4 justify-between">
            <div className="w-1/2">
              <input
                type="text"
                value={filterText}
                onChange={handleFilterChange}
                placeholder="Filtrar por descripción"
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="w-1/8">
              <input
                type="date"
                value={filterDate}
                onChange={handleDateFilterChange}
                min={minDate}
                max={maxDate}
                onKeyDown={(e) => e.preventDefault()}
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
          </div>
          <TableAnotacionComponent
            anotaciones={filteredAnotaciones}
            handleOpen={handleOpenModal}
            handleDelete={handleDeleteRequest}
            role={usuario?.rol}
          />
        </div>

        <div className="w-full md:w-1/5 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Anotaciones totales</h2>
          <div className="flex flex-row items-center text-gray-600 mb-4">
            <div className="flex flex-col w-1/2 items-center text-green-600 mb-4">
              <span className="text-3xl font-bold">{positivas}</span>
              <span className="text-sm">Positivas</span>
            </div>
            <div className="flex w-1/2 flex-col items-center text-red-600 mb-6">
              <span className="text-3xl font-bold">{negativas}</span>
              <span className="text-sm">Negativas</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="p-6 rounded-lg shadow-xl w-96 bg-[#1F2937] text-black dark:bg-[#1F2937] dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? 'Editar Anotación' : 'Nueva Anotación'}
            </h2>
            <div className="mb-4">
              <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">
                Tipo de Anotación
              </label>
              <select
                name="tipo"
                id="tipo"
                value={newAnotacion.tipo}
                onChange={(e) => setNewAnotacion({ ...newAnotacion, tipo: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-[#111827] dark:bg-[#111827] text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="Positiva">Positiva</option>
                <option value="Negativa">Negativa</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-sm text-gray-500 dark:text-gray-300">
                Descripción
              </label>
              <textarea
                name="descripcion"
                id="descripcion"
                value={newAnotacion.descripcion}
                onChange={(e) => setNewAnotacion({ ...newAnotacion, descripcion: e.target.value })}
                placeholder="Ingrese la descripción"
                rows="4"
                maxLength={280}
                className={`mt-2 block w-full rounded-lg border ${
                  newAnotacion.descripcion.trim().length < 5 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-[#111827] dark:bg-[#111827] text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none`}
              ></textarea>
              <div
                className={`text-right text-sm ${
                  newAnotacion.descripcion.trim().length < 5
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {newAnotacion.descripcion.length}/280 caracteres
              </div>
              {descripcionError && (
                <p className="text-red-500 text-sm mt-1">{descripcionError}</p>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-lg text-lg transition-colors duration-300 ${
                  newAnotacion.descripcion.trim().length >= 5
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-900 text-white cursor-not-allowed'
                }`}
                disabled={newAnotacion.descripcion.trim().length < 5}
              >
                {isEditMode ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white w-96">
            <h2 className="text-2xl font-bold mb-4">Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar esta anotación?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
              >
                Eliminar
              </button>
              <button
                onClick={closeConfirmDialog}
                className="px-4 py-2 bg-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
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
