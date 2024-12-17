import { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../../context/UsuarioContext";
import { AsignaturaContext } from "../../context/AsignaturaContext";
import { getAsistenciasPorRutyAsignatura } from "../../services/Asistencias.service"; 
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

const useVerAsistenciasAlumno = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { asignatura } = useContext(AsignaturaContext); 

  const rut = usuario ? usuario.rut : "";

  const idAsignatura = asignatura ? asignatura.idAsignatura : null;
  const nombreAsignatura = asignatura ? asignatura.nombre : "";

  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState(""); 
  const [cargando, setCargando] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const cargarAsistencias = async (rutAlumno, idAsignatura) => {
    try {
      setCargando(true);
      const response = await getAsistenciasPorRutyAsignatura(rutAlumno, idAsignatura);
      
      if (response && response.data && Array.isArray(response.data)) {
        setAsistencias(response.data);
      } else {
        setAsistencias([]);
        console.warn("La respuesta no tiene la estructura esperada:", response);
      }
    } catch (error) {
      console.error("Error al cargar las asistencias:", error);
      setMessage(error.message || "Error al cargar las asistencias.");
      setMessageType("error");
      setAsistencias([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      if (idAsignatura) {
        cargarAsistencias(rut, idAsignatura);
      } else {
        setAsistencias([]);
        setMessage("No se ha seleccionado una asignatura.");
        setMessageType("error");
      }
    } else {
      cargarUsuario();
    }
  }, [usuario, cargarUsuario, asignatura]);

  const handleFilterChange = (e) => {
    const text = e.target.value;
    setFilterText(text);
  };

  const handleFilterDateChange = (e) => {
    const date = e.target.value;
    setFilterDate(date);
  };

  const filteredAsistencias = asistencias.filter((asistencia) => {
    const matchesText = !filterText || normalizeText(asistencia.tipo).toLowerCase().includes(filterText.toLowerCase());

    const createdAtDate = asistencia.createdAt ? new Date(asistencia.createdAt) : null;
    const filterDateObj = filterDate ? new Date(filterDate) : null;
  
    const matchesDate = filterDateObj 
      ? createdAtDate.getFullYear() === filterDateObj.getFullYear() &&
        createdAtDate.getMonth() === filterDateObj.getMonth() &&
        createdAtDate.getDate() === filterDateObj.getDate()
      : true;  
    return matchesText && matchesDate;
  });

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const renderMessage = () => {
    if (messageType === "success") {
      return <SuccessAlert message={message} />;
    }
    if (messageType === "error") {
      return <ErrorAlert message={message} />;
    }
    return null;
  };

  return {
    usuario,
    asignatura,
    nombreAsignatura,
    asistencias,
    filterText,
    filterDate,
    cargando,
    message,
    messageType,
    handleFilterChange,
    handleFilterDateChange,
    filteredAsistencias,
    renderMessage
  };
};

export default useVerAsistenciasAlumno;
