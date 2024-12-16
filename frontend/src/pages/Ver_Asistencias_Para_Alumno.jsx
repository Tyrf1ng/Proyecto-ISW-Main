import React from "react";
import useVerAsistenciasAlumno from "../hooks/Asistencias/useVerAsistenciasAlumno";
import useTablaVistas from "../hooks/Asistencias/useTablaVistas";
import TableComponentAsistencias from "../components/TableComponentAsistencias";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

const Ver_Asistencias_Para_Alumno = () => {
  const {
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
  } = useVerAsistenciasAlumno();

  const { formatFecha, renderEstado, renderObservacion, prettifyRut } = useTablaVistas();

  // Mostrar spinner mientras carga
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
    );
  }

  // Mostrar mensaje de carga del usuario
  if (!usuario) {
    return <div className="text-center mt-8">Cargando usuario...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
      {renderMessage()}
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">Mis Asistencias</h1>
      <h2 className="text-lg mb-2 text-gray-600 dark:text-gray-300"></h2>
      <h2 className="text-lg mb-4 text-gray-600 dark:text-gray-300 font-bold">Asignatura: {nombreAsignatura || "No seleccionada"}</h2>
      
      <div className="mb-4 flex space-x-4">
        <select
          value={filterText}
          onChange={handleFilterChange}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="">Filtrar por estado...</option>
          <option value="presente">Presente</option>
          <option value="ausente">Ausente</option>
          <option value="justificado">Justificado</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDateChange}
          onKeyDown={(e) => e.preventDefault()} // Prevenir escritura manual
          className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <TableComponentAsistencias
        asistencias={filteredAsistencias}
        handleEdit={null} // No acciones para alumno
        handleDelete={null}
        showActions={false} // Ocultar acciones de editar y eliminar
        formatFecha={formatFecha}
        renderEstado={renderEstado}
        renderObservacion={renderObservacion}
        prettifyRut={prettifyRut}
      />

      {filteredAsistencias.length === 0 && (
        <p className="text-center mt-4 text-gray-500 dark:text-gray-400">No hay asistencias registradas.</p>
      )}
    </div>
  );
};

export default Ver_Asistencias_Para_Alumno;
