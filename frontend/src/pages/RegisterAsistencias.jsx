import { useState, useContext, useEffect } from "react";
import { createAsistencia } from "../services/Asistencias.service";
import { CursoContext } from "../context/CursoContext";
import TableRegisterAsistencias from "../components/TableRegisterAsistencias";
import { getAsistenciasAlumnoFecha } from "../services/Asistencias.service";
import { getSoloAlumnosByCurso } from "../services/cursos.service";
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';

const RegisterAsistencia = () => {
  const { curso } = useContext(CursoContext);
  const { idCurso } = curso;

  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        const alumnosData = await getSoloAlumnosByCurso(idCurso);
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };

    cargarAlumnos();
  }, [idCurso]);

  const handleRegister = async (attendance) => {
    try {
      if (!selectedDate) {
        setMensaje("Debe seleccionar una fecha");
        setMessageType("error");
        return;
      }

      const selected = new Date(selectedDate);
      const utcDate = new Date(selected.toISOString().substring(0, 10));

      const currentYear = new Date().getUTCFullYear();
      if (utcDate.getUTCFullYear() !== currentYear) {
        setMensaje("La fecha seleccionada no es del año actual.");
        setMessageType("error");
        return;
      }
      console.log("fecha actual hora y minutos actual", new Date().getDate(), new Date().getHours(), new Date().getMinutes());
      console.log("fecha seleccionada hora y minutos seleccionados", utcDate.getDate(), selected.getHours(), selected.getMinutes());
      const currentDate = new Date().getDate();
      if (utcDate.getDate() > currentDate) {
        setMensaje("La fecha seleccionada no puede ser mayor a la fecha actual.");
        setMessageType("error");
        return;
      }

      const dayOfWeek = utcDate.getUTCDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setMensaje("No se puede registrar asistencia en fines de semana.");
        setMessageType("error");
        return;
      }

      const selectedStudents = attendance.filter(
        (record) => record.presente || record.ausente || record.justificado
      );
      if (selectedStudents.length === 0) {
        setMensaje("Debe seleccionar al menos a 1 estudiante.");
        setMessageType("error");
        return;
      }

      for (let record of selectedStudents) {
        const asistencia = await getAsistenciasAlumnoFecha(
          record.rut,
          selectedDate
        );
        if (asistencia) {
          setMensaje(
            `Ya existe una asistencia registrada para el alumno ${record.nombre} en la fecha seleccionada.`
          );
          setMessageType("error");
          return;
        }
      }

      for (let record of selectedStudents) {
        const data = {
          id_asignatura: idCurso,
          rut: record.rut,
          tipo: record.presente
            ? "Presente"
            : record.ausente
              ? "Ausente"
              : "Justificado",
          observacion: record.justificado ? record.observacion : null,
          createdAt: selectedDate
            ? new Date(selectedDate).toISOString()
            : new Date().toISOString(),
        };

        await createAsistencia(data);
      }

      setMensaje("¡Asistencias registradas exitosamente!");
      setMessageType("success");
    } catch (error) {
      console.error("Error al registrar las asistencias:", error);
      setMensaje("Hubo un error al registrar las asistencias.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje("");
        setMessageType("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const renderMessage = () => {
    if (messageType === "success") {
      return <SuccessAlert message={mensaje} />;
    }

    if (messageType === "error") {
      return <ErrorAlert message={mensaje} />;
    }

    return null;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Registrar Asistencia
      </h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300 mb-2"
          htmlFor="fecha"
        >
          Fecha de Asistencia
        </label>
        <input
          type="date"
          id="fecha"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        />
      </div>
      <TableRegisterAsistencias
        students={alumnos}
        handleRegister={handleRegister}
      />
      {renderMessage()}
    </div>
  );
};

export default RegisterAsistencia;