import { useState, useEffect } from "react";
import { useAddReservas } from "../hooks/reservas/useAddReservas";
import { createReserva } from "@services/reservas.service";  
import SuccessAlert from "../components/SuccessAlert";
import WarningAlert from "../components/WarningAlert"; // Importa WarningAlert
import ErrorAlert from "../components/ErrorAlert"; // Importa ErrorAlert

function Add_Reserva() {
  const [newReserva, setNewReserva] = useState({
    rut: "",
    id_asignatura: "",
    id_curso: "",
    id_lab: "",
    id_horario: "",
    fecha: "", 
  });
  const { rutsDocentes, asignaturas, cursos, laboratorios, horarios, cargando, cargarAsignaturas, cargarCursos } = useAddReservas();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReserva({ ...newReserva, [name]: value });
    setMessage('');
    setMessageType('');
  };

  const handleSubmit = async () => {
    if (!newReserva.rut || !newReserva.id_asignatura || !newReserva.id_curso || !newReserva.id_lab || !newReserva.id_horario || !newReserva.fecha) {
      setMessage('');
      setMessageType('');
      setTimeout(() => {
        setMessage('Todos los campos son obligatorios.');
        setMessageType('warning');
      }, 0);
      return;
    }

    try {
      await createReserva(newReserva);
      setMessage('');
      setMessageType('');
      setTimeout(() => {
        setMessage('Reserva creada exitosamente');
        setMessageType('success');
      }, 0);
      setNewReserva({
        rut: "",
        id_asignatura: "",
        id_curso: "",
        id_lab: "",
        id_horario: "",
        fecha: "",
      });
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000); 
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      setMessage('');
      setMessageType('');
      setTimeout(() => {
        setMessage('Hubo un error al crear la reserva');
        setMessageType('error');
      }, 0);
    }
  };

  useEffect(() => {
    if (newReserva.rut) {
      cargarAsignaturas(newReserva.rut);
      cargarCursos(newReserva.rut);
    }
  }, [newReserva.rut]);

  if (cargando) return <p>Cargando...</p>;

  const renderMessage = () => {
    if (messageType === 'success') {
      return <SuccessAlert message={message} />;
    }

    if (messageType === 'warning') {
      return <WarningAlert message={message} />;
    }

    if (messageType === 'error') {
      return <ErrorAlert message={message} />;
    }

    return null;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-4xl text-center text-blue-100 mb-4">Reserva</h1>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Añadir Reserva</h3>

      <div className="mb-4">
        <label htmlFor="rut" className="block text-sm text-gray-500 dark:text-gray-300">Docente</label>
        <select
          name="rut"
          id="rut"
          value={newReserva.rut}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="">Seleccione docente</option>
          {rutsDocentes.map((docente) => (
            <option key={docente.rut} value={docente.rut}>
              {`${docente.nombre} ${docente.apellido} (${docente.rut})`}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="id_asignatura" className="block text-sm text-gray-500 dark:text-gray-300">Asignatura</label>
        <select
          name="id_asignatura"
          id="id_asignatura"
          value={newReserva.id_asignatura}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="">Seleccione asignatura</option>
          {asignaturas.map((asignatura) => (
            <option key={asignatura.id_asignatura} value={asignatura.id_asignatura}>
              {asignatura.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="id_curso" className="block text-sm text-gray-500 dark:text-gray-300">Curso</label>
        <select
          name="id_curso"
          id="id_curso"
          value={newReserva.id_curso}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="">Seleccione curso</option>
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
          value={newReserva.id_lab}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
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
        <label htmlFor="id_horario" className="block text-sm text-gray-500 dark:text-gray-300">Horario</label>
        <select
          name="id_horario"
          id="id_horario"
          value={newReserva.id_horario}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
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
          name="fecha"
          id="fecha"
          value={newReserva.fecha}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 w-full"
        >
          Guardar Reserva
        </button>
      </div>

      {renderMessage()}
    </div>
  );
}

export default Add_Reserva;