import { useEffect, useState, useContext } from 'react';
import useReservas from '../hooks/reservas/useReservas';
import useLabs from '../hooks/labs/useLabs'; 
import { useHorarios } from '../hooks/horarios/useHorarios'; 
import TableReservasDocentes from '../components/TableReservasDocentes'; 
import { addDays, isWithinInterval, isAfter, isSameDay, parseISO, getYear, format } from 'date-fns';
import { UsuarioContext } from '../context/UsuarioContext';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';
import useAlert from "../hooks/useAlerts.jsx";
import { AnimatePresence } from "framer-motion";

const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const ReservasDocentes = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { reservas, reservasConNombre, fetchReservas, mapReservasConNombre, editReserva, removeReserva, fetchCursosByProfesor, cursos, error } = useReservas();
  const { labs: laboratorios, fetchLabs } = useLabs();
  const { horarios, fetchHorarios } = useHorarios(); 
  const [filterText, setFilterText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('option2');
  const [showPreviousReservations, setShowPreviousReservations] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [alert, showAlert] = useAlert();

  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    } else {
      fetchReservas();
      fetchLabs(); 
      fetchHorarios(); 
      fetchCursosByProfesor(usuario.rut);
    }
  }, [usuario]);

  useEffect(() => {
    if (reservas.length > 0 && laboratorios.length > 0) {
      mapReservasConNombre(laboratorios);
    }
  }, [reservas, laboratorios]);

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleFilterSelectChange = (e) => setSelectedFilter(e.target.value); 
  const handleShowPreviousReservationsChange = (e) => setShowPreviousReservations(e.target.checked);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  const handleEditOpen = (reserva) => {
    setCurrentReserva({
      ...reserva,
      usuario: usuario.rut,
      id_asignatura: reserva.id_asignatura,
      id_horario: reserva.id_horario
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setValidationError(null);
  };

  const handleDeleteOpen = (reserva) => {
    setCurrentReserva({
      ...reserva,
      nombre_profesor: usuario.nombre,
      fecha: reserva.fecha,
      horario: reserva.horario
    });
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => setDeleteOpen(false);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReserva({ ...currentReserva, [name]: value });
  };

  const handleEditSubmit = async () => {
    const today = new Date();
    const maxDate = addDays(today, 31);
    const reservaDate = new Date(currentReserva.fecha);

    if (!currentReserva.id_lab || !currentReserva.id_horario || !currentReserva.fecha || !currentReserva.id_asignatura || !currentReserva.id_curso) {
      setValidationError('Todos los campos son obligatorios.');
      return;
    }

    if (reservaDate.getMonth() === 0 || reservaDate.getMonth() === 1) {
      setValidationError("No se pueden hacer reservas para los meses de enero y febrero.");
      return;
    }

    if (reservaDate.getDay() === 5 || reservaDate.getDay() === 6) {
      setValidationError("No se pueden hacer reservas los días sábados y domingos.");
      return;
    }

    if (!isAfter(reservaDate, today)) {
      setValidationError("La fecha de la reserva debe ser posterior a la fecha actual.");
      return;
    }

    if (!isWithinInterval(reservaDate, { start: today, end: maxDate })) {
      setValidationError("La fecha de la reserva debe estar dentro del próximo mes.");
      return;
    }

    if (getYear(reservaDate) !== getYear(today)) {
      setValidationError("La reserva no puede ser para el año siguiente.");
      return;
    }

    try {
      await editReserva(currentReserva.id_reserva, currentReserva);
      handleEditClose();
      fetchReservas();
      showAlert("Reserva actualizada exitosamente.", "success");
    } catch (error) {
      console.error("Error al actualizar la reserva: ", error);
      showAlert(error.message || "Hubo un error al actualizar la reserva.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await removeReserva(currentReserva.id_reserva);
      handleDeleteClose();
      fetchReservas();
      setDeleteSuccess(true); 
      showAlert("Reserva eliminada exitosamente.", "success");
    } catch (error) {
      setDeleteError("No se puede borrar la reserva.");
      console.error("Error al eliminar la reserva: ", error);
      showAlert("Hubo un error al eliminar la reserva.", "error");
    }
  };

  const filteredReservas = reservasConNombre.filter(reserva => {
    if (reserva.rut !== usuario?.rut) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (!reserva.fecha) return false;
    const reservaDate = parseISO(reserva.fecha);
    reservaDate.setHours(0, 0, 0, 0); 
    const currentYear = today.getFullYear();
  
    if (showPreviousReservations) {
      if (reservaDate >= today || reservaDate.getFullYear() !== currentYear) {
        return false;
      }
    } else {
      if (reservaDate < today && !isSameDay(reservaDate, today)) {
        return false;
      }
    }
  
    const normalizedFilterText = normalizeString(filterText);
    if (selectedFilter === 'option2') {
      return reserva.nombre_lab && normalizeString(reserva.nombre_lab).includes(normalizedFilterText);
    } else if (selectedFilter === 'option4') {
      return reserva.nombreCurso && normalizeString(reserva.nombreCurso).includes(normalizedFilterText);
    } else if (selectedFilter === 'option5') {
      return reservaDate.getMonth() + 1 === parseInt(selectedMonth) && reservaDate.getFullYear() === parseInt(selectedYear);
    }
    return true;
  });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl text-center font-semibold mb-10 text-gray-800 dark:text-white">Mis Reservas</h1>
      <div className="flex items-center mb-1">
        {selectedFilter === 'option2' && (
          <input
            type="text"
            placeholder="Buscar por nombre del laboratorio"
            value={filterText}
            onChange={handleFilterChange}
            className="mt-7 block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            style={{ width: '325px' }}
          />
        )}
        {selectedFilter === 'option4' && (
          <input
            type="text"
            placeholder="Buscar por Curso"
            value={filterText}
            onChange={handleFilterChange}
            className="mt-7 block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            style={{ width: '325px' }}
          />
        )}
        {selectedFilter === 'option5' && (
          <div className="flex items-center mt-7">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            >
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="ml-4 block rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            >
              {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        )}
        <div className="ml-4 mt-1">
          <label htmlFor="filter" className="block text-sm text-gray-500 dark:text-gray-300">Seleccionar filtro</label>
          <select
            name="filter"
            id="filter"
            value={selectedFilter}
            onChange={handleFilterSelectChange}
            className="mt-1 block w-64 h-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-400 px-4 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="option2">Por Laboratorio</option>
            <option value="option4">Por Curso</option>
            <option value="option5">Por Mes</option>
          </select>
        </div>
        <div className="flex items-right ml-auto mt-8">
          <input
            type="checkbox"
            id="showPreviousReservations"
            checked={showPreviousReservations}
            onChange={handleShowPreviousReservationsChange}
            className="mr-1"
            style={{ height: '20px' }}
          />
          <label htmlFor="showPreviousReservations" className="text-sm text-gray-500 dark:text-gray-300" style={{ lineHeight: '20px' }}>Mostrar reservas anteriores</label>
        </div>
      </div>

      <TableReservasDocentes reservas={filteredReservas} handleOpen={handleEditOpen} handleDelete={handleDeleteOpen} showActions={!showPreviousReservations} />

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

      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleEditClose}>
          <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Editar Reserva</h2>
            {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
            <div className="mb-4">
              <label htmlFor="id_curso" className="block text-sm text-gray-500 dark:text-gray-300">Curso</label>
              <select
                name="id_curso"
                id="id_curso"
                value={currentReserva?.id_curso || ''}
                onChange={handleEditInputChange}
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                {cursos.map((curso) => (
                  <option key={curso.id_curso} value={curso.id_curso}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="id_lab" className="block text-sm text-gray-500 dark:text-gray-300">Laboratorio</label>
              <select
                name="id_lab"
                id="id_lab"
                value={currentReserva?.id_lab || ''}
                onChange={handleEditInputChange}
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                {laboratorios.map((lab) => (
                  <option key={lab.id_lab} value={lab.id_lab}>
                    {lab.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="id_horario" className="block text-sm text-gray-500 dark:text-gray-300">Horario</label>
              <select
                name="id_horario"
                id="id_horario"
                value={currentReserva?.id_horario || ''} 
                onChange={handleEditInputChange}
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                {horarios.map((horario) => (
                  <option key={horario.id_horario} value={horario.id_horario}>
                    {`${horario.hora_inicio} - ${horario.hora_fin}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="fecha" className="block text-sm text-gray-500 dark:text-gray-300">Fecha</label>
              <input
                name="fecha"
                type="date"
                value={currentReserva?.fecha || ''}
                onChange={handleEditInputChange}
                placeholder="Fecha"
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
              />
            </div>
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
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar la reserva del día "{currentReserva?.fecha ? format(parseISO(currentReserva.fecha), 'dd') : ''}" del mes de "{currentReserva?.fecha ? new Date(currentReserva.fecha).toLocaleString('es-ES', { month: 'long' }) : ''}" en el horario "{currentReserva?.horario}"?
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

export default ReservasDocentes;