import { useState } from 'react';
import { format as formatTempo } from "@formkit/tempo";
import { prettifyRut } from "react-rut-formatter";

const useTablaVistas = () => {
  // Función para formatear fechas
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "Sin Fecha";
    return formatTempo(new Date(fechaISO).toISOString().split("T")[0], "DD-MM-YYYY");
  };

  // Función para renderizar estado con estilos
  const renderEstado = (tipo) => {
    return (
      <div
        className={`inline px-3 py-1 text-sm font-normal rounded-full ${
          tipo === "Presente"
            ? "bg-green-500 text-white"
            : tipo === "Ausente"
              ? "bg-red-500 text-white"
              : "bg-orange-500 text-white"
        }`}
      >
        {tipo}
      </div>
    );
  };

  // Función para renderizar observación
  const renderObservacion = (observacion) => {
    return (
      <div className="text-gray-800 dark:text-white">
        {observacion || "Sin Observación"}
      </div>
    );
  };

  return {
    formatFecha,
    renderEstado,
    renderObservacion,
    prettifyRut
  };
};

export default useTablaVistas;
