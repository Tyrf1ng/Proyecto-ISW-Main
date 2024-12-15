import { useEffect, useState, useContext } from 'react';
import useReservas from '../hooks/reservas/useReservas';
import useLabs from '../hooks/labs/useLabs'; 
import { useHorarios } from '../hooks/horarios/useHorarios'; 
import TableReservasDocentes from '../components/TableReservasDocentes'; 
import { addDays, isWithinInterval, isAfter, isSameDay, parseISO } from 'date-fns';
import { UsuarioContext } from '../context/UsuarioContext';
import { useAddReservasDocentes } from '../hooks/reservas/useAddReservasDocentes';

const ReservasDocentes = () => {
  const { usuario } = useContext(UsuarioContext);
  const { reservas, reservasConNombre, fetchReservas, mapReservasConNombre, error } = useReservas();
  const { labs: laboratorios, fetchLabs } = useLabs();
  const { horarios, fetchHorarios } = useHorarios(); 
  const [filterText, setFilterText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('option2'); // Default to 'Filtrar por Laboratorio'
  const [showPreviousReservations, setShowPreviousReservations] = useState(false); // Estado para mostrar reservas anteriores
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Estado para el mes seleccionado
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Estado para el año seleccionado

  const { laboratorios: labs, horarios: horariosDisponibles, cargando } = useAddReservasDocentes();

  useEffect(() => {
    fetchReservas();
    fetchLabs(); 
    fetchHorarios(); 
  }, []);

  useEffect(() => {
    if (reservas.length > 0 && laboratorios.length > 0) {
      mapReservasConNombre(laboratorios);
    }
  }, [reservas, laboratorios]);

  const handleFilterChange = (e) => setFilterText(e.target.value);
  const handleFilterSelectChange = (e) => setSelectedFilter(e.target.value); 
  const handleShowPreviousReservationsChange = (e) => setShowPreviousReservations(e.target.checked); // Maneja el cambio del checkbox
  const handleMonthChange = (e) => setSelectedMonth(e.target.value); // Maneja el cambio del mes
  const handleYearChange = (e) => setSelectedYear(e.target.value); // Maneja el cambio del año

  const filteredReservas = reservasConNombre.filter(reserva => {
    if (reserva.rut !== usuario?.rut) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    if (!reserva.fecha) {
      return false;
    }
  
    const reservaDate = parseISO(reserva.fecha);
    reservaDate.setHours(0, 0, 0, 0); 
    
    if (!showPreviousReservations && reservaDate < today && !isSameDay(reservaDate, today)) {
      return false;
    }
  
    if (selectedFilter === 'option5') {
      return reservaDate.getMonth() + 1 === parseInt(selectedMonth) && reservaDate.getFullYear() === parseInt(selectedYear);
    }
  
    if (selectedFilter === 'option2') {
      return reserva.nombre_lab && reserva.nombre_lab.toLowerCase().includes(filterText.toLowerCase());
    } else if (selectedFilter === 'option4') {
      return reserva.nombreCurso && reserva.nombreCurso.toLowerCase().includes(filterText.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <h1 className="text-4xl text-center font-semibold text-blue-100 mb-4">Mis Reservas</h1>
        {error && <div className="text-red-500">{error}</div>}
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
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
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
                {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + 1 - i).map(year => (
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
              <option value="option2">Filtrar por Laboratorio</option>
              <option value="option4">Filtrar por Curso</option>
              <option value="option5">Filtrar por Mes</option>
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

        <TableReservasDocentes
            reservas={filteredReservas}
        />
    </div>
  );
};

export default ReservasDocentes;