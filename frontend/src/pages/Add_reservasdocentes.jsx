import React, { useEffect, useState, useContext } from 'react';
import { useAddReservasDocentes } from '../hooks/reservas/useAddReservasDocentes';
import { createReserva } from '@services/reservas.service';
import SuccessAlert from '../components/SuccessAlert';
import WarningAlert from '../components/WarningAlert';
import ErrorAlert from '../components/ErrorAlert';
import { isAfter, isWithinInterval, addMonths } from 'date-fns';
import { UsuarioContext } from '../context/UsuarioContext';
import { AnimatePresence } from 'framer-motion';

const AddReservasDocentes = () => {
  const { usuario } = useContext(UsuarioContext);
  const {
    laboratorios,
    horarios,
    cargando,
    selectedLab,
    selectedHorario,
    fecha,
    validationError,
    handleSeleccionarLab,
    handleSeleccionarHorario,
    handleFechaChange,
    asignatura,
    curso,
    setSelectedLab,
    setSelectedHorario,
    setFecha,
  } = useAddReservasDocentes();

  const [localMessage, setLocalMessage] = useState('');
  const [localMessageType, setLocalMessageType] = useState('');

  useEffect(() => {
    if (localMessage) {
      const timer = setTimeout(() => {
        setLocalMessage("");
        setLocalMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [localMessage]);

  const handleSubmit = async () => {
    const today = new Date();
    const reservaDate = new Date(fecha);
    const maxDate = addMonths(today, 1);

    if (!selectedLab || !selectedHorario || !fecha || !asignatura || !curso) {
      setLocalMessage('Todos los campos son obligatorios.');
      setLocalMessageType('warning');
      return;
    }
    if (reservaDate.getMonth() === 0 || reservaDate.getMonth() === 1) {
      setLocalMessage("No se pueden hacer reservas para los meses de enero y febrero.");
      setLocalMessageType("error");
      return;
    }
    if (reservaDate.getDay() === 5 || reservaDate.getDay() === 6) {
      setLocalMessage("No se pueden hacer reservas los días sábados y domingos.");
      setLocalMessageType("error");
      return;
    }
    if (!isAfter(reservaDate, today)) {
      setLocalMessage("La fecha de la reserva debe ser posterior a la fecha actual.");
      setLocalMessageType("error");
      return;
    }
    if (!isWithinInterval(reservaDate, { start: today, end: maxDate })) {
      setLocalMessage("La fecha de la reserva debe estar dentro del próximo mes.");
      setLocalMessageType("error");
      return;
    }

    const newReserva = {
      rut: usuario.rut,
      id_asignatura: asignatura.idAsignatura,
      id_curso: curso.idCurso,
      id_lab: selectedLab,
      id_horario: selectedHorario,
      fecha,
    };

    try {
      await createReserva(newReserva);
      setLocalMessage('Reserva creada exitosamente.');
      setLocalMessageType('success');
      setSelectedLab('');
      setSelectedHorario('');
      setFecha('');
    } catch (error) {
      console.error("Error al crear la reserva: ", error);
      setLocalMessage(error.message || 'Hubo un error al crear la reserva');
      setLocalMessageType('error');
    }
  };

  const renderMessage = () => {
    return (
      <AnimatePresence>
        {localMessageType === 'success' && <SuccessAlert message={localMessage} key="success" />}
        {localMessageType === 'warning' && <WarningAlert message={localMessage} key="warning" />}
        {localMessageType === 'error' && <ErrorAlert message={localMessage} key="error" />}
      </AnimatePresence>
    );
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-4xl font-semibold text-center text-blue-100 mb-14 mt-4">Añadir Reserva</h1>
      <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          Reserva para {asignatura ? asignatura.nombre : 'Asignatura'} del {curso ? curso.nombre : 'Curso'}
        </h3>

        <div className="mb-4">
          <label htmlFor="laboratorio" className="block text-sm text-gray-500 dark:text-gray-300">Laboratorio</label>
          <select
            id="laboratorio"
            value={selectedLab}
            onChange={handleSeleccionarLab}
            className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="">Seleccione laboratorio</option>
            {laboratorios.map((lab) => (
              <option key={lab.id_lab} value={lab.id_lab}>
                {lab.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="horario" className="block text-sm text-gray-500 dark:text-gray-300">Horario</label>
          <select
            id="horario"
            value={selectedHorario}
            onChange={handleSeleccionarHorario}
            className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="">Seleccione horario</option>
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
            type="date"
            id="fecha"
            value={fecha}
            onChange={handleFechaChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        {renderMessage()}

        <div className="mt-10 dark:bg-gray-900">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 w-full"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReservasDocentes;