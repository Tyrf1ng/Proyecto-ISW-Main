import { AnimatePresence } from "framer-motion";
import useAlert from "../hooks/useAlerts.jsx";
import useAlumnos from "../hooks/useAlumnos.jsx";
import useAnotacionForm from "../hooks/anotaciones/useAnotacionForm.jsx";
import WarningAlert from "../components/WarningAlert.jsx";
import SuccessAlert from "../components/SuccessAlert.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";
import TituloAnotaciones from "../components/TituloAnotaciones";

const Add_anotaciones = () => {
  const [alert, showAlert] = useAlert();

  const {
    filteredAlumnos,
    selectedAlumno,
    searchTerm,
    isListVisible,
    handleSearchChange,
    handleAlumnoSelectHook,
    resetAlumnos,
  } = useAlumnos();

  const {
    newAnotacion,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
  } = useAnotacionForm(selectedAlumno, resetAlumnos, showAlert);

  const maxDescripcionLength = 280;
  const minDescripcionLength = 5;
  const descripcionLength = newAnotacion.descripcion.length;
  const isMaxReached = descripcionLength > maxDescripcionLength;
  const isMinNotReached = descripcionLength < minDescripcionLength;

  const handleLetterOnlyChange = (e) => {
    const { value } = e.target;
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, "");
    handleSearchChange({ target: { value: lettersOnly } });
  };

  const handleSelectAlumnoClick = (alumno) => {
    handleAlumnoSelectHook(alumno);
  };

  const isFormValid =
    !isMaxReached &&
    !isMinNotReached &&
    newAnotacion.tipo &&
    selectedAlumno &&
    descripcionLength >= minDescripcionLength;

  return (
    <div className="dark:bg-gray-800 min-h-screen p-4">
      <TituloAnotaciones />
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Añadir Anotación
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <label
                  htmlFor="tipo"
                  className="block text-sm text-gray-500 dark:text-gray-300"
                >
                  Tipo de Anotación
                </label>
                <select
                  name="tipo"
                  id="tipo"
                  value={newAnotacion.tipo}
                  onChange={handleSelectChange}
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
                  required
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option value="Positiva">Positiva</option>
                  <option value="Negativa">Negativa</option>
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="alumno"
                  className="block text-sm text-gray-500 dark:text-gray-300"
                >
                  Buscar Alumno
                </label>
                <input
                  type="text"
                  id="alumno"
                  value={searchTerm}
                  onChange={handleLetterOnlyChange}
                  placeholder="Buscar Alumno"
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>
            {isListVisible && filteredAlumnos.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto">
                <ul className="mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                  {filteredAlumnos.map((alumno) => (
                    <li
                      key={alumno.rut}
                      onClick={() => handleSelectAlumnoClick(alumno)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white"
                    >
                      {alumno.nombre} {alumno.apellido}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="descripcion"
                className="block text-sm text-gray-500 dark:text-gray-300"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={newAnotacion.descripcion}
                onChange={handleInputChange}
                maxLength={maxDescripcionLength}
                placeholder="Escribe la descripción"
                rows="4"
                className={`mt-2 block w-full rounded-lg border ${
                  isMaxReached
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none`}
                required
              />
              <small className="text-sm">
                {isMinNotReached ? (
                  <span className="block text-red-500">
                    *{minDescripcionLength}/{maxDescripcionLength} caracteres
                  </span>
                ) : (
                  <span className="block text-gray-500">
                    {descripcionLength}/{maxDescripcionLength} caracteres
                  </span>
                )}
              </small>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid}
              >
                Crear Anotación
              </button>
            </div>
          </form>
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
        </div>
      </div>
    </div>
  );
};

export default Add_anotaciones;
