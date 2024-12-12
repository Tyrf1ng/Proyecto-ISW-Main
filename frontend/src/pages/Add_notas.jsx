import { useContext, useEffect, useState } from "react";
import { CursoContext } from "../context/CursoContext";
import { getSoloAlumnosByCurso } from '@services/cursos.service';
import { createNota } from "../services/notas.service";
import { getAsignaturasByProfesor } from "@services/asignatura.service";
import { useAuth } from "../context/AuthContext";
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';

function Add_Notas() {
  const { curso } = useContext(CursoContext);
  const { user } = useAuth();
  const [newNota, setNewNota] = useState({
    tipo: "",
    valor: "",
    rut: "",
    id_asignatura: "", // Nueva asignatura por defecto vacío
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
        if (asignaturasObtenidas && asignaturasObtenidas.length === 1) {
          const asignatura = asignaturasObtenidas[0]; // Solo hay una asignatura
          setAsignaturas([asignatura]); 
          setNewNota((prev) => ({
            ...prev,
            id_asignatura: asignatura.id_asignatura, 
          }));
        } else {
          console.warn("No se encontraron asignaturas para este profesor.");
          setAsignaturas([]);
        }
      } catch (error) {
        console.error("Error al cargar las asignaturas:", error);
      } finally {
        setCargando(false);
      }
    };
  
    cargarAsignaturas();
  }, [user]);

  // Cargar alumnos cuando se monta el componente o cambia curso.idCurso
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!curso.idCurso) {  // Comprobar si el curso tiene un idCurso válido
        console.error("ID del curso no válido:", curso.idCurso);
        return;
      }
      try {
        // Obtener alumnos según curso.idCurso
        const alumnosData = await getSoloAlumnosByCurso(curso.idCurso);  
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData.slice(0, 5));
        } else {
          console.error("Formato inesperado de datos:", alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };

    cargarAlumnos();
  }, [curso.idCurso]); 

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = alumnos.filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(query)
    );
    setFilteredAlumnos(filtered.slice(0, 5));
    setIsListVisible(filtered.length > 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNota({ ...newNota, [name]: value });
  };

  const handleAlumnoSelect = (alumno) => {
    setSelectedAlumno(alumno);
    setNewNota((prev) => ({
      ...prev,
      rut: alumno.rut,
      id_asignatura: asignaturas.length === 1 ? asignaturas[0].id_asignatura : "",
    }));
    setSearchTerm(`${alumno.nombre} ${alumno.apellido}`);
    setIsListVisible(false);
  };

  const handleSubmit = async () => {
    // Limpia el mensaje antes de validar
    setMessage("");
    setMessageType("");

    // Validaciones
    if (!newNota.rut || !newNota.tipo || !newNota.valor || !newNota.id_asignatura) {
      setMessage("Debe completar todos los campos.");
      setMessageType("warning");
      return;
    }

    // Asegúrate de que el valor sea numérico
    const valorNumerico = parseFloat(newNota.valor);
    if (isNaN(valorNumerico) || valorNumerico < 2.0 || valorNumerico > 7.0) {
      setMessage("El valor de la nota debe estar entre 2.0 y 7.0.");
      setMessageType("error");
      return;
    }

    try {
      console.log("Creando nota:", newNota);
      await createNota({ ...newNota, valor: valorNumerico }); // Se asegura de enviar `valor` como número
      setMessage("Nota creada exitosamente.");
      setMessageType("success");

      // Restablece el formulario
      setNewNota({
        tipo: "",
        valor: "",
        rut: "",
        id_asignatura: "",
      });

      // Restablece otras variables de estado
      setSelectedAlumno(null);
      setSearchTerm("");
      setIsListVisible(false);
    } catch (error) {
      console.error("Error al crear la nota:", error);
      setMessage("Hubo un error al crear la nota.");
      setMessageType("error");
    }
  };

  const renderMessage = () => {
    if (messageType === 'success') {
      return <SuccessAlert message={message} />;
    }

    if (messageType === 'error') {
      return <ErrorAlert message={message} />;
    }

    if (messageType === 'warning') {
      return <WarningAlert message={message} />;
    }

    return null;
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
        <label className="block text-sm text-gray-500 dark:text-gray-300">Asignatura</label>
        {asignaturas.length === 1 ? (
          <p className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2">
            {asignaturas[0].nombre}
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay asignaturas disponibles.</p>
        )}
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
          <ul className="list-none border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mt-2 bg-white dark:bg-gray-900 shadow-lg">
            {filteredAlumnos.map((alumno) => (
              <li
                key={alumno.rut}
                onClick={() => handleAlumnoSelect(alumno)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white"
              >
                {alumno.nombre} {alumno.apellido}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Valor */}
      <div className="mb-4">
        <label htmlFor="valor" className="block text-sm text-gray-500 dark:text-gray-300">Valor</label>
        <input
          type="text"
          name="valor"
          value={newNota.valor}
          onChange={handleInputChange}
          placeholder="Ingrese el valor de la nota"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      {renderMessage()}

      <button
        onClick={handleSubmit}
        className="block w-full rounded-lg bg-blue-500 dark:bg-blue-800 text-white px-6 py-2 text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-900 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Crear Nota
      </button>
    </div>
  );
}

export default Add_Notas;
