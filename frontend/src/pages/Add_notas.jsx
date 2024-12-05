import { useContext, useEffect, useState } from "react";
import { CursoContext } from "../context/CursoContext";
import { getAlumnosByCurso } from "../services/alumnos.service";
import { createNota } from "../services/notas.service";
import { getAsignaturasByProfesor } from "@services/asignatura.service";
import { useAuth } from "../context/AuthContext";

function Add_Notas() {
  const { idCurso } = useContext(CursoContext);
  const { user } = useAuth();
  const [newNota, setNewNota] = useState({
    tipo: "",
    valor: "",
    rut: "",
    id_asignatura: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListVisible, setIsListVisible] = useState(false);
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true); 

  // Cargar asignaturas al iniciar el componente
  useEffect(() => {
    const cargarAsignaturas = async () => {
      if (!user || !user.rut) {
        console.error("El usuario no tiene un RUT asociado.");
        setCargando(false);
        return;
      }
      try {
        const asignaturasObtenidas = await getAsignaturasByProfesor(user.rut);
        console.log("Asignaturas obtenidas:", asignaturasObtenidas); // Verifica qué datos llegan
        if (asignaturasObtenidas && asignaturasObtenidas.length > 0) {
          setAsignaturas(asignaturasObtenidas);  // Guardamos las asignaturas en el estado
        } else {
          console.warn("No se encontraron asignaturas para este profesor.");
          setAsignaturas([]);  // En caso de que no haya asignaturas
        }
      } catch (error) {
        console.error("Error al cargar las asignaturas:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarAsignaturas();
  }, [user]);

  // Cargar alumnos del curso
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        const alumnosData = await getAlumnosByCurso(idCurso);
        setAlumnos(alumnosData);
        setFilteredAlumnos(alumnosData);
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };

    cargarAlumnos();
  }, [idCurso]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = alumnos.filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(query)
    );
    setFilteredAlumnos(filtered);
    setIsListVisible(filtered.length > 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNota({ ...newNota, [name]: value });
  };

  const handleAlumnoSelect = (alumno) => {
    setSelectedAlumno(alumno);
    setNewNota({ ...newNota, rut: alumno.rut });
    setSearchTerm(`${alumno.nombre} ${alumno.apellido}`);
    setIsListVisible(false);
  };

  const handleSubmit = async () => {
    if (!newNota.rut || !newNota.tipo || !newNota.valor || !newNota.id_asignatura) {
      setMessage("Debe completar todos los campos.");
      setMessageType("warning");
      return;
    }
    if (!newNota.valor || newNota.valor < 1 || newNota.valor > 7) {
      setMessage("El valor de la nota debe estar entre 1.0 y 7.0.");
      setMessageType("error");
      return;
    }

    try {
      await createNota(newNota);
      setMessage("Nota creada exitosamente.");
      setMessageType("success");
      setNewNota({ tipo: "", valor: "", rut: "", id_asignatura: "" });
      setSelectedAlumno(null);
      setFilteredAlumnos(alumnos);
    } catch (error) {
      console.error("Error al crear la nota:", error);
      setMessage("Hubo un error al crear la nota.");
      setMessageType("error");
    }
  };

  const renderMessage = () => {
    if (!message) return null;

    const messageClasses =
      "fixed top-5 right-5 w-full max-w-sm overflow-hidden bg-[#111827] rounded-lg shadow-md z-50 animate-bounce-slow";

    return (
      <div className={messageClasses}>
        <div className="px-4 py-2 -mx-3">
          <div className="mx-3">
            <span
              className={`font-semibold ${messageType === "success" ? "text-emerald-500" : messageType === "error" ? "text-red-500" : "text-yellow-400"}`}
            >
              {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
            </span>
            <p className="text-sm text-gray-100">{message}</p>
          </div>
        </div>
      </div>
    );
  };

  // Mostrar el mensaje de carga si es necesario
  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Añadir Notas</h2>

      {/* Tipo de Nota */}
      <div className="mb-4">
        <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">Tipo de Nota</label>
        <select
          name="tipo"
          id="tipo"
          value={newNota.tipo}
          onChange={handleInputChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="">Seleccione tipo</option>
          <option value="Prueba">Prueba</option>
          <option value="Tarea">Tarea</option>
          <option value="Test">Test</option>
          <option value="Presentacion">Presentación</option>
        </select>
      </div>

      {/* Asignatura */}
      <div className="mb-4">
        <label htmlFor="id_asignatura" className="block text-sm text-gray-500 dark:text-gray-300">Asignatura</label>
        <select
  name="id_asignatura"
  id="id_asignatura"
  value={newNota.id_asignatura}
  onChange={handleInputChange}
  className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
>
  <option value="">Seleccione asignatura</option>
  {asignaturas && asignaturas.length > 0 ? (
    asignaturas.map((asignatura) => (
      <option key={asignatura.id_asignatura} value={asignatura.id_asignatura}>
        {asignatura.nombre}
      </option>
    ))
  ) : (
    <option value="" disabled>No hay asignaturas disponibles</option>
  )}
</select>

      </div>

      {/* Búsqueda de alumno */}
      <div className="mb-4">
        <label htmlFor="alumno" className="block text-sm text-gray-500 dark:text-gray-300">Alumno</label>
        <input
          type="text"
          name="alumno"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar alumno"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
        {isListVisible && (
          <ul className="mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            {filteredAlumnos.map((alumno) => (
              <li key={alumno.rut} className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white" onClick={() => handleAlumnoSelect(alumno)}>
                {alumno.nombre} {alumno.apellido}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Valor de la Nota */}
      <div className="mb-4">
        <label htmlFor="valor" className="block text-sm text-gray-500 dark:text-gray-300"
        >Valor
        </label>
        <input
          type="number"
          name="valor"
          value={newNota.valor}
          onChange={handleInputChange}
          min="1.0"
          max="7.0"
          step="0.1"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Botón de enviar */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
      >
        Crear Nota
      </button>

      {renderMessage()}
    </div>
  );
}

export default Add_Notas;
