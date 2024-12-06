import { useState, useContext, useEffect, useRef } from "react";
import { createAsistencia } from "../services/Asistencias.service";
import { getAlumnosByCurso } from "../services/alumnos.service";
import { CursoContext } from "../context/CursoContext";

function RegistrarAsistencias() {
  const { idCurso } = useContext(CursoContext);
  const [estado, setEstado] = useState("");
  const [observacion, setObservacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [messageType, setMessageType] = useState(""); // Para tipo de mensaje (success, warning, error)
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListVisible, setIsListVisible] = useState(false); // Para manejar la visibilidad de la lista de alumnos
  const inputRef = useRef(null); // Referencia al input de búsqueda
  const listRef = useRef(null); // Referencia al contenedor de la lista de sugerencias

  // Cargar los alumnos del curso
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        const alumnosData = await getAlumnosByCurso(idCurso);
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };

    cargarAlumnos();
  }, [idCurso]);

  // Manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = alumnos.filter((usuario) =>
      `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(query)
    );
    setFilteredAlumnos(filtered);
    setIsListVisible(filtered.length > 0); // Mostrar la lista si hay resultados
  };

  // Manejar la selección de un alumno
  const handleAlumnoSelect = (usuario) => {
    setSelectedAlumno(usuario);
    setSearchTerm(`${usuario.nombre} ${usuario.apellido}`);
    setIsListVisible(false); // Cerrar la lista después de seleccionar el alumno
  };

  // Manejar el envío del formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlumno) {
      setMensaje("Debe seleccionar un alumno.");
      setMessageType("warning");
      return;
    }

    try {
      const data = {
        id_asignatura: idCurso,
        rut: selectedAlumno.rut,
        tipo: estado,
        observacion: estado === "Justificado" ? observacion : null,
      };

      console.log("Datos enviados al backend:", data);

      await createAsistencia(data);
      setMensaje("¡Asistencia registrada exitosamente!");
      setMessageType("success");
      setSelectedAlumno(null);
      setEstado("");
      setObservacion("");
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      setMensaje("Hubo un error al registrar la asistencia.");
      setMessageType("error");
    }
  };

  // Detectar clic fuera del input y lista para cerrarlas
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) && // Clic fuera del input
        listRef.current &&
        !listRef.current.contains(event.target) // Clic fuera de la lista
      ) {
        setIsListVisible(false); // Cerrar la lista
      }
    };

    // Escuchar clics fuera del área
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Limpiar el evento al desmontar
    };
  }, []);

  // Renderizar los mensajes de éxito, error o advertencia
  const renderMessage = () => {
    const messageClasses =
      "fixed top-5 right-5 w-full max-w-sm overflow-hidden bg-[#111827] rounded-lg shadow-md z-50";

    if (messageType === "success") {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-emerald-500">Success</span>
              <p className="text-sm text-gray-100">{mensaje}</p>
            </div>
          </div>
        </div>
      );
    }

    if (messageType === "error") {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-red-500">Error</span>
              <p className="text-sm text-gray-100">{mensaje}</p>
            </div>
          </div>
        </div>
      );
    }

    if (messageType === "warning") {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-yellow-400">Warning</span>
              <p className="text-sm text-gray-100">{mensaje}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Registrar Asistencia
      </h2>

      <div className="mb-4">
        <label
          htmlFor="alumno"
          className="block text-sm text-gray-500 dark:text-gray-300"
        >
          Buscar Alumno
        </label>
        <input
          ref={inputRef} // Asociar la referencia al input
          type="text"
          id="alumno"
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={() => setIsListVisible(true)} // Mostrar la lista al hacer clic en el campo de búsqueda
          placeholder="Buscar Alumno"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      {isListVisible && filteredAlumnos.length > 0 && (
        <div
          ref={listRef}
          className="absolute mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-900 shadow-xl rounded-lg z-10"
        >
          <ul className="mt-2">
            {filteredAlumnos.map((usuario) => (
              <li
                key={usuario.rut_alumno}
                onClick={() => handleAlumnoSelect(usuario)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white"
              >
                {usuario.nombre} {usuario.apellido}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="estado"
          className="block text-sm text-gray-500 dark:text-gray-300"
        >
          Estado
        </label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="" disabled>
            Selecciona Estado
          </option>
          <option value="Presente">Presente</option>
          <option value="Ausente">Ausente</option>
          <option value="Justificado">Justificado</option>
        </select>
      </div>

      {estado === "Justificado" && (
        <div className="mb-4">
          <label
            htmlFor="observacion"
            className="block text-sm text-gray-500 dark:text-gray-300"
          >
            Observación
          </label>
          <textarea
            id="observacion"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows="4"
            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
          />
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={manejarSubmit}
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 w-full"
        >
          Registrar Asistencia
        </button>
      </div>

      {renderMessage()}
    </div>
  );
}

export default RegistrarAsistencias;
