import { useContext, useState } from "react";
import { createNota } from "../services/notas.service";
import useAlumnos from "../hooks/useAlumnos.jsx";
import { AsignaturaContext } from "../context/AsignaturaContext";
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';
import useAlert from "../hooks/useAlerts.jsx";
import { AnimatePresence } from "framer-motion";

function Add_Notas() {
  const [alert, showAlert] = useAlert();
  const { asignatura } = useContext(AsignaturaContext);
  const {
    filteredAlumnos,
    searchTerm,
    isListVisible,
    handleSearchChange,
    handleAlumnoSelectHook,
    resetAlumnos,
  } = useAlumnos();

  const [newNota, setNewNota] = useState({
    tipo: '',
    valor: '',
    rut: '',
    id_asignatura: asignatura?.idAsignatura || '',
  });

  const handleAlumnoSelect = (alumno) => {
    setNewNota((prevNota) => ({ ...prevNota, rut: alumno.rut }));
    handleAlumnoSelectHook(alumno); 
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNota({ ...newNota, [name]: value });
  };

  const handleSubmit = async () => {
    if (!newNota.rut || !newNota.tipo || !newNota.valor || !newNota.id_asignatura) {
      showAlert("Debe completar todos los campos.", "warning");
      return;
    }

    const valorNumerico = parseFloat(newNota.valor);
    const decimalPart = newNota.valor.split('.')[1];

    if (isNaN(valorNumerico) || valorNumerico < 2.0 || valorNumerico > 7.0 || (decimalPart && decimalPart.length > 1)) {
      showAlert("El valor de la nota debe estar entre 2.0 y 7.0 y tener como máximo un decimal.", "error");
      return;
    }

    try {
      await createNota({ ...newNota, valor: valorNumerico });
      showAlert("Nota creada exitosamente.", "success");
      
      setNewNota({
        tipo: "",
        valor: "",
        rut: "",
        id_asignatura: asignatura?.idAsignatura || '',
      });

      resetAlumnos();
    } catch (error) {
      console.error("Error al crear la nota:", error);
      showAlert("Hubo un error al crear la nota.", "error");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Añadir Notas</h2>

      <div className="mb-4">
        <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">Tipo de Nota</label>
        <select
          name="tipo"
          id="tipo"
          value={newNota.tipo}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="" disabled={newNota.tipo !== ""}>Seleccione tipo</option>
          <option value="Prueba">Prueba</option>
          <option value="Tarea">Tarea</option>
          <option value="Test">Test</option>
          <option value="Presentacion">Presentación</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="alumno" className="block text-sm text-gray-500 dark:text-gray-300">Alumno</label>
        <input
          type="text"
          name="alumno"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar alumno"
          className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
        {isListVisible && (
          <ul className="list-none border border-gray-300 dark:border-gray-600 rounded-md mt-2 bg-white dark:bg-gray-900 shadow-lg max-h-40 overflow-auto">
            {filteredAlumnos.map((alumno) => (
              <li
                key={alumno.rut}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white"
                onClick={() => handleAlumnoSelect(alumno)}
              >
                {alumno.nombre} {alumno.apellido}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="valor" className="block text-sm text-gray-500 dark:text-gray-300">Nota</label>
        <input
          type="number"
          name="valor"
          value={newNota.valor}
          onChange={handleInputChange}
          placeholder="Ingrese la nota"
          className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          max="7.0"
          min="2.0"
          step="0.1"
        />
      </div>

      <AnimatePresence>
        {alert.type === "warning" && (
          <WarningAlert message={alert.message} key="warning" />
        )}
        {alert.type === "success" && (
          <SuccessAlert message={alert.message} key="success" />
        )}
        {alert.type === "error" && (
          <ErrorAlert message={alert.message} key="error" />
        )}
      </AnimatePresence>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full py-2 px-4 text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Crear Nota
      </button>
    </div>
  );
}

export default Add_Notas;