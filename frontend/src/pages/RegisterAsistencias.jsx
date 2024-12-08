import { useState, useContext, useEffect } from "react";
import { createAsistencia } from "../services/Asistencias.service";
import { getAlumnosByCurso } from "../services/alumnos.service";
import { CursoContext } from "../context/CursoContext";
import TableRegisterAsistencias from "../components/TableRegisterAsistencias";

const RegisterAsistencia = () => {
  const { curso } = useContext(CursoContext);
  const { idCurso } = curso; 

  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        const alumnosData = await getAlumnosByCurso(idCurso);
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
      for (let record of attendance) {
        if (record.presente || record.ausente || record.justificado) {
          const data = {
            id_asignatura: idCurso,
            rut: record.rut,
            tipo: record.presente ? "Presente" : record.ausente ? "Ausente" : "Justificado",
            observacion: record.justificado ? record.observacion : null,
          };

          await createAsistencia(data);
        }
      }
      setMensaje("¡Asistencias registradas exitosamente!");
      setMessageType("success");
    } catch (error) {
      console.error("Error al registrar las asistencias:", error);
      setMensaje("Hubo un error al registrar las asistencias.");
      setMessageType("error");
    }
  };

  const renderMessage = () => {
    const messageClasses = "fixed top-5 right-5 w-full max-w-sm overflow-hidden bg-[#111827] rounded-lg shadow-md z-50";

    if (messageType === "success") {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-emerald-500">Success</span>
              <p className="text-sm text-gray-100">{mensaje}</p>
            </div>
          </div>
        </div>
      );
    }

    if (messageType === "error") {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-red-500">Error</span>
              <p className="text-sm text-gray-100">{mensaje}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Registrar Asistencia</h2>
      <TableRegisterAsistencias students={alumnos} handleRegister={handleRegister} />
      {renderMessage()}
    </div>
  );
};

export default RegisterAsistencia;