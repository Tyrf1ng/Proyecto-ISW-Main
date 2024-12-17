import useVerAsistenciasProfesor from "../hooks/Asistencias/useVerAsistenciasProfesor";
import useTablaVistas from "../hooks/Asistencias/useTablaVistas";
import TableComponentAsistencias from "../components/TableComponentAsistencias";

const VerAsistencias = () => {
  const {

    filterText,
    filterDate,
    cargando,
    isModalOpen,
    asistenciaSeleccionada,
    confirmDialogOpen,

    charCount,
    nombreCurso,

    handleFilterChange,
    handleFilterDateChange,
    handleEdit,
    handleDeleteRequest,
    handleConfirmDelete,
    handleSave,
    handleModalChange,

    filteredAsistencias,
    renderMessage,

    setIsModalOpen,
    handleCancelDelete 
  } = useVerAsistenciasProfesor();

  const { formatFecha, renderEstado, renderObservacion, prettifyRut } = useTablaVistas();

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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Asistencias para {nombreCurso || "el curso"}
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
          style={{colorScheme: "dark" }}
          />
      </div>

      <TableComponentAsistencias
        asistencias={filteredAsistencias}
        handleEdit={handleEdit}
        handleDelete={handleDeleteRequest}
        showActions={true}
        formatFecha={formatFecha}
        renderEstado={renderEstado}
        renderObservacion={renderObservacion}
        prettifyRut={prettifyRut}
      />

      {isModalOpen && asistenciaSeleccionada && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)} 
        >
          <div
            className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
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
                  maxLength={60} 
                  className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
                ></textarea>
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
                onClick={handleCancelDelete} 
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
