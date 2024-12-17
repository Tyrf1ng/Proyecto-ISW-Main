import { useState, useEffect, useContext } from "react";
import { CursoContext } from "../../context/CursoContext";
import { AsignaturaContext } from "../../context/AsignaturaContext";
import { UsuarioContext } from "../../context/UsuarioContext"; 

import {
  deleteAsistencia,
  updateAsistencia,
  getAsistenciasPorCursoYAsignatura
} from "../../services/Asistencias.service";
import { getUsuarios } from "../../services/usuarios.service"; 
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

const useVerAsistenciasProfesor = () => {
  const { curso } = useContext(CursoContext);
  const { idCurso, nombre: nombreCurso } = curso;
  const { asignatura } = useContext(AsignaturaContext);
  const { idAsignatura } = asignatura;
  const { usuario } = useContext(UsuarioContext); 

  const [usuariosList, setUsuariosList] = useState([]); 
  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [cargando, setCargando] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const nombreAsignatura = asignatura.nombre || "la asignatura";

  const [charCount, setCharCount] = useState(0);

  const handleCancelDelete = () => setConfirmDialogOpen(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const dataUsuarios = await getUsuarios();
        setUsuariosList(dataUsuarios || []);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        setMessage("Error al cargar los usuarios");
        setMessageType("error");
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    const cargarAsistencias = async () => {
      if (!idCurso || !idAsignatura) {
        console.error("ID del curso o de la asignatura no válido:", idCurso, idAsignatura);
        setCargando(false);
        return;
      }

      if (usuariosList.length === 0) {
        return;
      }

      try {
        const datosAsistencias = await getAsistenciasPorCursoYAsignatura(idCurso, idAsignatura);
        
        const asistenciasConNombres = datosAsistencias.map((asistencia) => {
          const usuario = usuariosList.find((u) => u.rut === asistencia.rut);
          return {
            ...asistencia,
            nombre: usuario ? usuario.nombre : "Nombre no encontrado",
            apellido: usuario ? usuario.apellido : "Apellido no encontrado"
          };
        });
        
        setAsistencias(asistenciasConNombres || []);
      } catch (error) {
        console.error("Error al cargar las asistencias:", error);
        setMessage("Error al cargar las asistencias");
        setMessageType("error");
      } finally {
        setCargando(false);
      }
    };
    cargarAsistencias();
  }, [idCurso, idAsignatura, usuariosList]);

  const handleFilterChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[0-9]/g, ""); 
    setFilterText(sanitizedValue);
  };

  const handleFilterDateChange = (e) => {
    const date = e.target.value;
    if (date && !Date.parse(date)) { 
      console.error("Formato de fecha inválido:", date);
      return;
    }
    setFilterDate(date);
  };

  const handleEdit = (asistencia) => {
    setAsistenciaSeleccionada(asistencia);
    setIsModalOpen(true);
    setCharCount(asistencia.observacion ? asistencia.observacion.length : 0);
  };

  const handleDeleteRequest = (id_asistencia) => {
    setAsistenciaToDelete(id_asistencia);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!asistenciaToDelete) {
        console.error("ID de asistencia no válido para eliminar.");
        return;
      }

      await deleteAsistencia(asistenciaToDelete);

      setAsistencias(
        asistencias.filter(
          (asistencia) => asistencia.id_asistencia !== asistenciaToDelete
        )
      );
      setMessage("Asistencia eliminada con éxito");
      setMessageType("success");
    } catch (error) {
      console.error("Error al eliminar la asistencia:", error);
      setMessage("Hubo un error al eliminar la asistencia");
      setMessageType("error");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!asistenciaSeleccionada || !asistenciaSeleccionada.id_asistencia) {
        console.error("ID de asistencia no válido", asistenciaSeleccionada);
        throw new Error("ID de asistencia no válido");
      }
  
      const asistenciaOriginal = asistencias.find(
        (a) => a.id_asistencia === asistenciaSeleccionada.id_asistencia
      );
  
      const tipoNoCambio = asistenciaOriginal && asistenciaOriginal.tipo === asistenciaSeleccionada.tipo;
      const observacionNoCambio = asistenciaOriginal && asistenciaOriginal.observacion === asistenciaSeleccionada.observacion;
  
      if (tipoNoCambio && observacionNoCambio) {
        setMessage("No se han realizado cambios en la asistencia");
        setMessageType("error");
        return;
      }
  
      if (
        asistenciaSeleccionada.tipo === "Justificado" &&
        (!asistenciaSeleccionada.observacion || asistenciaSeleccionada.observacion.trim() === "")
      ) {
        setMessage("El campo de observación no puede estar vacío");
        setMessageType("error");
        return;
      }
  
      const updatedAsistencia = {
        ...asistenciaSeleccionada,
        tipo: asistenciaSeleccionada.tipo,
        observacion: asistenciaSeleccionada.tipo === "Justificado" ? asistenciaSeleccionada.observacion.trim() : null
      };
  
      const response = await updateAsistencia(updatedAsistencia);
  
      setIsModalOpen(false);
  
      const updatedData = response.data || response; 
  
      setAsistencias(
        asistencias.map((asistencia) =>
          asistencia.id_asistencia === updatedAsistencia.id_asistencia
            ? { ...asistencia, tipo: updatedData.tipo, observacion: updatedData.observacion }
            : asistencia
        )
      );
      setMessage("Asistencia actualizada con éxito");
      setMessageType("success");
    } catch (error) {
      console.error("Error al actualizar la asistencia:", error);
      setMessage("Hubo un error al actualizar la asistencia");
      setMessageType("error");
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    if (name === 'observacion') {
      if (value.length <= 60) { 
        setAsistenciaSeleccionada({
          ...asistenciaSeleccionada,
          [name]: value,
        });
        setCharCount(value.length); 
      }
    } else {
      setAsistenciaSeleccionada({
        ...asistenciaSeleccionada,
        [name]: value,
      });
    }
  };

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredAsistencias = asistencias.filter((asistencia) => {
    const sanitizedFilterText = normalizeText(filterText)
      .replace(/[^a-zA-Z\s]/g, "")
      .toLowerCase();
    
    const matchesText = normalizeText(
      `${asistencia.nombre} ${asistencia.apellido}`
    )
      .toLowerCase()
      .includes(sanitizedFilterText);
  
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
      }, 3500);
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
    usuariosList,
    asistencias,
    filterText,
    filterDate,
    cargando,
    isModalOpen,
    asistenciaSeleccionada,
    confirmDialogOpen,
    asistenciaToDelete,
    message,
    messageType,
    charCount,
    nombreAsignatura,
    handleFilterChange,
    handleFilterDateChange,
    handleEdit,
    handleDeleteRequest,
    handleConfirmDelete,
    handleSave,
    handleModalChange,
    handleCancelDelete,
    filteredAsistencias,
    renderMessage,
    setIsModalOpen,
    nombreCurso
  };
};

export default useVerAsistenciasProfesor;
