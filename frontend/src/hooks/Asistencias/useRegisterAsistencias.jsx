import { useState, useContext, useEffect } from "react";
import { createAsistencia, getAsistenciasAlumnoFecha } from "../../services/Asistencias.service";
import { CursoContext } from "../../context/CursoContext";
import { AsignaturaContext } from "../../context/AsignaturaContext";
import { getSoloAlumnosByCurso } from "../../services/cursos.service";
import SuccessAlert from '../../components/SuccessAlert';
import ErrorAlert from '../../components/ErrorAlert';
import WarningAlert from '../../components/WarningAlert';

const useRegisterAsistencia = () => {
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
        setMensaje("Máximo 30 días de diferencia con la fecha actual.");
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

  return {
    alumnos,
    mensaje,
    messageType,
    selectedDate,
    setSelectedDate,
    handleRegister,
    renderMessage,
    nombreAsignatura
  };
};

export default useRegisterAsistencia;
