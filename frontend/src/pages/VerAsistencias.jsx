import { useState, useEffect, useContext } from "react";
import { CursoContext } from "../context/CursoContext";
import { getAsistenciasCurso, deleteAsistencia, updateAsistencia } from "../services/Asistencias.service";
import TableComponentAsistencias from "../components/TableComponentAsistencias";

const VerAsistencias = () => {
  const { idCurso } = useContext(CursoContext);
  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [cargando, setCargando] = useState(true);

  // Estado para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [asistenciaSeleccionada, setAsistenciaSeleccionada] = useState(null);

  // Estado para el diálogo de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState(null);

  useEffect(() => {
    const cargarAsistencias = async () => {
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

  const handleEdit = (asistencia) => {
    console.log("Asistencia seleccionada para editar:", asistencia);
    setAsistenciaSeleccionada(asistencia);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id_asistencia) => {
    setAsistenciaToDelete(id_asistencia); // Guardamos el ID de la asistencia a eliminar
    setConfirmDialogOpen(true); // Abrimos el cuadro de confirmación
  };

  const handleConfirmDelete = async () => {
    try {
      if (!asistenciaToDelete) {
        console.error("ID de asistencia no válido para eliminar.");
        return;
      }

      await deleteAsistencia(asistenciaToDelete); // Llamada a la API para eliminar la asistencia

      // Actualiza la lista de asistencias después de la eliminación
      setAsistencias(asistencias.filter((asistencia) => asistencia.id_asistencia !== asistenciaToDelete));
    } catch (error) {
      console.error("Error al eliminar la asistencia:", error);
    } finally {
      setConfirmDialogOpen(false); // Cierra el cuadro de confirmación
    }
  };

  const handleSave = async () => {
    try {
      if (!asistenciaSeleccionada || !asistenciaSeleccionada.id_asistencia) {
        console.error("ID de asistencia no válido", asistenciaSeleccionada);
        throw new Error("ID de asistencia no válido");
      }

      const updatedAsistencia = {
        ...asistenciaSeleccionada,
        tipo: asistenciaSeleccionada.tipo,
      };

      await updateAsistencia(updatedAsistencia);
      
      setIsModalOpen(false);
      setAsistencias(asistencias.map((asistencia) =>
        asistencia.id_asistencia === asistenciaSeleccionada.id_asistencia ? asistenciaSeleccionada : asistencia
      ));
    } catch (error) {
      console.error("Error al actualizar la asistencia:", error);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setAsistenciaSeleccionada({
      ...asistenciaSeleccionada,
      [name]: value,
    });
  };

  const filteredAsistencias = asistencias.filter((asistencia) =>
    `${asistencia.alumno.nombre} ${asistencia.alumno.apellido}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar por nombre..."
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
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
            <h2 className="text-2xl font-bold mb-4 text-white">Editar Asistencia </h2>
            <div className="mb-4">
              <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">
                Estado de la Asistencia
              </label>
              <select
                id="tipo"
                name="tipo"
                value={asistenciaSeleccionada.tipo}
                onChange={handleModalChange}
                className="mt-2 w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2"
              >
                <option value="Presente">Presente</option>
                <option value="Ausente">Ausente</option>
                <option value="Justificado">Justificado</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
                Guardar
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">
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
            <h2 className="text-2xl font-bold mb-4">¿Estás seguro de que quieres eliminar esta asistencia?</h2>
            <div className="flex justify-around mt-6">
              <button onClick={handleConfirmDelete} className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg">
                Eliminar
              </button>
              <button onClick={() => setConfirmDialogOpen(false)} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">
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
