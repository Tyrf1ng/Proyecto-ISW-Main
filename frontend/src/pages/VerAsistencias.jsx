import { useState, useEffect, useContext } from "react";
import { CursoContext } from "../context/CursoContext";
import {
  getAsistenciasCurso,
  deleteAsistencia,
  updateAsistencia,
} from "../services/Asistencias.service";
import TableComponentAsistencias from "../components/TableComponentAsistencias";
import { format as formatTempo } from "@formkit/tempo"; // Import format function
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

const VerAsistencias = () => {
  const { curso } = useContext(CursoContext);
  const { idCurso } = curso;
  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState(""); // State for date filter
  const [cargando, setCargando] = useState(true);

  // Estado para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);

  // Estado para el diálogo de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const cargarAsistencias = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        setCargando(false);
        return;
      }
      try {
        const datosAsistencias = await getAsistenciasCurso(idCurso);
        setAsistencias(datosAsistencias || []);
      } catch (error) {
        console.error("Error al cargar las asistencias:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarAsistencias();
  }, [idCurso]);

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleFilterDateChange = (e) => {
    const date = e.target.value;
    if (!Date.parse(date)) {
      console.error("Invalid date format:", date);
      return;
    }
    setFilterDate(date);
  };

  const handleEdit = (asistencia) => {
    setAsistenciaSeleccionada(asistencia);
    setIsModalOpen(true);
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
  
      // Validación específica para observación vacía en tipo Justificado
      if (asistenciaSeleccionada.tipo === "Justificado" && (!asistenciaSeleccionada.observacion || asistenciaSeleccionada.observacion.trim() === "")) {
        setMessage("El campo de observación no puede estar vacío");
        setMessageType("error");
        return;
      }
  
      const updatedAsistencia = {
        ...asistenciaSeleccionada,
        tipo: asistenciaSeleccionada.tipo,
        observacion: asistenciaSeleccionada.tipo === "Justificado" ? asistenciaSeleccionada.observacion : null
      };
  
      const response = await updateAsistencia(updatedAsistencia);
  
      setIsModalOpen(false);
  
      const newAsistencia = {
        ...updatedAsistencia,
        ...response, 
        usuario: updatedAsistencia.usuario 
      };
  
      setAsistencias(
        asistencias.map((asistencia) =>
          asistencia.id_asistencia === updatedAsistencia.id_asistencia
            ? newAsistencia
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
    setAsistenciaSeleccionada({
      ...asistenciaSeleccionada,
      [name]: value,
    });
  };

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredAsistencias = asistencias.filter((asistencia) => {
    const sanitizedFilterText = normalizeText(filterText)
      .replace(/[^a-zA-Z\s]/g, "")
      .toLowerCase();
    const matchesText = normalizeText(
      `${asistencia.usuario.nombre} ${asistencia.usuario.apellido}`
    )
      .toLowerCase()
      .includes(sanitizedFilterText);

    const formattedCreatedAt = formatTempo(
      new Date(asistencia.createdAt).toISOString(),
      "DD-MM-YYYY"
    );
    const formattedFilterDate = filterDate
      ? formatTempo(new Date(filterDate).toISOString(), "DD-MM-YYYY")
      : "";

    const matchesDate = filterDate
      ? formattedCreatedAt === formattedFilterDate
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

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      {renderMessage()}
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

      {/* Modal de Edición */}
      {isModalOpen && asistenciaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Editar Asistencia{" "}
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
            {/* Mostrar el campo de observación solo si el tipo es "Justificado" */}
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
                  className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
                ></textarea>
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

      {/* Cuadro de Confirmación para eliminar */}
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
