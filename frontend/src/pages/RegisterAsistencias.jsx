import React from "react";
import useRegisterAsistencia from "../hooks/Asistencias/useRegisterAsistencias";
import TableRegisterAsistencias from "../components/TableRegisterAsistencias";

const RegisterAsistencia = () => {
  const {
    alumnos,
    selectedDate,
    setSelectedDate,
    handleRegister,
    renderMessage,
    nombreCurso,
  } = useRegisterAsistencia();

  return (
    <div className="p-4 bg-gray-10 dark:bg-gray-800 mt-7 rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Asistencias para {nombreCurso || "el curso "}
      </h1>
      <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md relative mt-7">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Registrar Asistencia
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="fecha"
          >
            Fecha de Asistencia
          </label>
          <input
            type="date"
            id="fecha"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
          />
        </div>
        <TableRegisterAsistencias
          students={alumnos}
          handleRegister={handleRegister}
        />
        {renderMessage()}
      </div>
    </div>
  );
};

export default RegisterAsistencia;
