import { useState, useContext, useEffect } from "react";
import { createAsistencia } from "../services/Asistencias.service";
import { CursoContext } from "../context/CursoContext";
import TableRegisterAsistencias from "../components/TableRegisterAsistencias";
import { getAsistenciasAlumnoFecha } from "../services/Asistencias.service";
import { getSoloAlumnosByCurso } from "../services/cursos.service";
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';
import { AsignaturaContext } from "../context/AsignaturaContext";

const RegisterAsistencia = () => {
  const { curso } = useContext(CursoContext);
  const { idCurso } = curso;
  const { asignatura } = useContext(AsignaturaContext);
  const { idAsignatura } = asignatura; 


  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const nombreAsignatura = asignatura.nombre || "la asignatura";

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

      if(selectedDate > new Date().toISOString().substring(0, 10)) {
        setMensaje("No se puede registrar asistencia en fechas futuras.");
        setMessageType("warning");
        return;
      }

      const selected = new Date(selectedDate);
      const utcDate = new Date(selected.toISOString().substring(0, 10));
      const currentDate = new Date();
      const differenceInTime = currentDate.getTime() - selected.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      if (differenceInDays > 31 || differenceInDays === 30) {
        setMensaje("Maximo 30 dias de diferencia con la fecha actual.");
        setMessageType("warning");
        return;
      }

      const currentYear = new Date().getUTCFullYear();
      if (utcDate.getUTCFullYear() !== currentYear) {
        setMensaje("La fecha seleccionada no es del año actual.");
        setMessageType("warning");
        return;
      }

      const dayOfWeek = utcDate.getUTCDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setMensaje("No se puede registrar asistencia en fines de semana.");
        setMessageType("warning");
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
        const asistencia = await getAsistenciasAlumnoFecha(record.rut, selectedDate, idAsignatura);
        if (asistencia) {
            setMensaje(`Ya existe una asistencia registrada para el alumno ${record.nombre} en la fecha seleccionada.`);
            setMessageType("error");
            return;
        }
      }

      for (let record of selectedStudents) {
        if (record.justificado && (!record.observacion || record.observacion.trim() === "")) {
          setMensaje(`El campo de observación no puede estar vacío para el alumno ${record.nombre}.`);
          setMessageType("warning");
          return;
        }

        const data = {
          id_asignatura: idAsignatura,
          id_curso: idCurso,
          rut: record.rut,
          tipo: record.presente
            ? "Presente"
            : record.ausente
              ? "Ausente"
              : "Justificado",
          observacion: record.justificado ? record.observacion.trim() : null,
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
    if (messageType === "warning") {
      return <WarningAlert message={mensaje} />;
    }

    return null;
  };

  return (
    <div className="p-4 bg-gray-10 dark:bg-gray-800 mt-7 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300 mb-8 text-center">
        Asistencias para {nombreAsignatura || "la asignatura"}
      </h1>
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md relative mt-7">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
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
    </div>
  );
};


export default RegisterAsistencia;