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
    // Verificar que la asistencia tiene el id correctamente
    console.log("Asistencia seleccionada para editar:", asistencia);
    setAsistenciaSeleccionada(asistencia); // Guardamos la asistencia seleccionada
    setIsModalOpen(true); // Abrimos el modal
  };

  const handleDelete = async (id_asistencia) => {
    try {
      // Verifica que el id_asistencia esté presente
      if (!id_asistencia) {
        throw new Error("ID de asistencia no válido para eliminar.");
      }

      // Llamada a la API para eliminar la asistencia
      await deleteAsistencia(id_asistencia);
      
      // Actualiza la lista de asistencias después de la eliminación
      setAsistencias(asistencias.filter((asistencia) => asistencia.id_asistencia !== id_asistencia));
    } catch (error) {
      console.error("Error al eliminar la asistencia:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Verifica que la asistencia seleccionada tenga un id_asistencia
      if (!asistenciaSeleccionada || !asistenciaSeleccionada.id_asistencia) {
        console.error("ID de asistencia no válido", asistenciaSeleccionada);
        throw new Error("ID de asistencia no válido");
      }

      // Mostrar en consola la asistencia seleccionada antes de guardar
      console.log("Asistencia a actualizar:", asistenciaSeleccionada);

      // Llamada a la función de actualización
      const updatedAsistencia = {
        ...asistenciaSeleccionada,
        tipo: asistenciaSeleccionada.tipo, // Asegúrate de que el estado del tipo esté correcto
      };

      // Asegúrate de que estamos enviando el `id_asistencia` correctamente
      console.log("Datos enviados para actualizar:", updatedAsistencia);

      // Llamada a la API para actualizar la asistencia
      await updateAsistencia(updatedAsistencia);
      
      // Cierra el modal después de guardar
      setIsModalOpen(false);

      // Actualiza la lista de asistencias después de la actualización
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
        handleDelete={handleDelete}
      />

      {/* Modal de Edición */}
      {isModalOpen && asistenciaSeleccionada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Editar Asistencia </h2> {/* Cambié el color aquí */}
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
    </div>
  );
};

export default VerAsistencias;
