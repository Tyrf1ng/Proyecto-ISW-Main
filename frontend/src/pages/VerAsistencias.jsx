// src/pages/VerAsistencias.jsx

import { useState, useEffect, useContext } from "react";
import { CursoContext } from "../context/CursoContext";
import { AsignaturaContext } from "../context/AsignaturaContext";
import { UsuarioContext } from "../context/UsuarioContext"; 

import {
  deleteAsistencia,
  updateAsistencia,
  getAsistenciasPorCursoYAsignatura
} from "../services/Asistencias.service";
import { getUsuarios } from "../services/Usuarios.service"; 
import TableComponentAsistencias from "../components/TableComponentAsistencias";
import { format as formatDate } from "@formkit/tempo";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

const VerAsistencias = () => {
  const { curso } = useContext(CursoContext);
  const { idCurso } = curso;
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

  // Agregar estado para el contador de caracteres
  const [charCount, setCharCount] = useState(0);

  // useEffect para obtener la lista completa de usuarios
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

  // useEffect para obtener las asistencias una vez que se tienen los usuarios
  useEffect(() => {
    const cargarAsistencias = async () => {
      // Validar que tengamos idCurso e idAsignatura
      if (!idCurso || !idAsignatura) {
        console.error("ID del curso o de la asignatura no válido:", idCurso, idAsignatura);
        setCargando(false);
        return;
      }

      // Esperar a que la lista de usuarios esté cargada
      if (usuariosList.length === 0) {
        return;
      }

      try {
        // Obtener las asistencias de la asignatura en el curso
        const datosAsistencias = await getAsistenciasPorCursoYAsignatura(idCurso, idAsignatura);
        
        // Mapear las asistencias con los nombres y apellidos de los usuarios
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
  }, [idCurso, idAsignatura, usuariosList]); // Dependencias: idCurso, idAsignatura y usuariosList

  const handleFilterChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[0-9]/g, ""); // Eliminar números
    setFilterText(sanitizedValue);
  };

  const handleFilterDateChange = (e) => {
    const date = e.target.value;
    if (date && !Date.parse(date)) { // Permitir cadena vacía
      console.error("Formato de fecha inválido:", date);
      return;
    }
    setFilterDate(date);
  };
  

  const handleEdit = (asistencia) => {
    setAsistenciaSeleccionada(asistencia);
    setIsModalOpen(true);
    // Inicializar el contador de caracteres
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
        observacion: asistenciaSeleccionada.tipo === "Justificado" ? asistenciaSeleccionada.observacion : null
      };
  
      // Pasar un único objeto
      const response = await updateAsistencia(updatedAsistencia);
  
      setIsModalOpen(false);
  
      // Si la respuesta tiene los datos anidados en 'data'
      const updatedData = response.data || response; // Ajustar según la estructura real
  
      // Actualizar asistencias sin alterar nombre y apellido
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
      if (value.length <= 60) { // Limitar a 60 caracteres
        setAsistenciaSeleccionada({
          ...asistenciaSeleccionada,
          [name]: value,
        });
        setCharCount(value.length); // Actualizar el contador
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
  
    // Formatear fechas a 'yyyy-MM-dd' para comparación
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

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-10 dark:bg-gray-800 mt-7 rounded-lg">
      {renderMessage()}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-300 mb-8 text-center">
        Asistencias para {nombreAsignatura || "la asignatura"}
      </h1>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar por nombre..."
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDateChange}
          onKeyDown={(e) => e.preventDefault()}
          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>
      <TableComponentAsistencias
        asistencias={filteredAsistencias}
        handleEdit={handleEdit}
        handleDelete={handleDeleteRequest}
      />

      {isModalOpen && asistenciaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Editar Asistencia
            </h2>
            <div className="mb-4">
              <label
                htmlFor="tipo"
                className="block text-sm text-gray-500 dark:text-gray-300"
              >
                Estado de la Asistencia
              </label>
              <select
                id="tipo"
                name="tipo"
                value={asistenciaSeleccionada.tipo}
                onChange={handleModalChange}
                className="mt-2 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2"
              >
                <option
                  value="Presente"
                  disabled={asistenciaSeleccionada.tipo === "Presente"}
                >
                  Presente
                </option>
                <option
                  value="Ausente"
                  disabled={asistenciaSeleccionada.tipo === "Ausente"}
                >
                  Ausente
                </option>
                <option
                  value="Justificado"
                  disabled={asistenciaSeleccionada.tipo === "Justificado"}
                >
                  Justificado
                </option>
              </select>
            </div>
            {asistenciaSeleccionada.tipo === "Justificado" && (
              <div className="mb-4">
                <label
                  htmlFor="observacion"
                  className="block text-sm text-gray-500 dark:text-gray-300"
                >
                  Observación
                </label>
                <textarea
                  id="observacion"
                  name="observacion"
                  value={asistenciaSeleccionada.observacion || ""}
                  onChange={handleModalChange}
                  rows={4}
                  maxLength={60} // Agregar restricción de 60 caracteres
                  className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
                ></textarea>
                {/* Agregar el contador de caracteres */}
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {60 - charCount} caracteres restantes
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white">
            <h2 className="text-2xl font-bold mb-4">
              ¿Estás seguro de que quieres eliminar esta asistencia?
            </h2>
            <div className="flex justify-around mt-6">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmDialogOpen(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerAsistencias;
