import { useContext, useEffect, useState } from "react";
import { CursoContext } from "../context/CursoContext";
import { getSoloAlumnosByCurso } from '@services/cursos.service';
import { createNota } from "../services/notas.service";
import { AsignaturaContext } from "../context/AsignaturaContext";
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import WarningAlert from '../components/WarningAlert';

function Add_Notas() {
  const { curso } = useContext(CursoContext);
  const { asignatura } = useContext(AsignaturaContext);
  const [newNota, setNewNota] = useState({
    tipo: '',
    valor: '',
    rut: '',
    id_asignatura: asignatura.idAsignatura || '',
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListVisible, setIsListVisible] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!curso.idCurso) {  // Comprobar si el curso tiene un idCurso válido
        console.error("ID del curso no válido:", curso.idCurso);
        return;
      }
      try {
        // Mostrar mensaje de carga
        setCargando(true);

        // Obtener alumnos según curso.idCurso
        const alumnosData = await getSoloAlumnosByCurso(curso.idCurso);
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData.slice(0, 5));
        } else {
          console.error("Formato inesperado de datos:", alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false); // Cambiar el estado de carga a false siempre que termine la operación
      }
    };

    cargarDatos();
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
    }));
    setSearchTerm(`${alumno.nombre} ${alumno.apellido}`);
    setIsListVisible(false);
  };

  const handleSubmit = async () => {
    setMessage("");
    setMessageType("");

    if (!newNota.rut || !newNota.tipo || !newNota.valor || !newNota.id_asignatura) {
      setMessage("Debe completar todos los campos.");
      setMessageType("warning");
      return;
    }

    const valorNumerico = parseFloat(newNota.valor);
    if (isNaN(valorNumerico) || valorNumerico < 2.0 || valorNumerico > 7.0) {
      setMessage("El valor de la nota debe estar entre 2.0 y 7.0.");
      setMessageType("error");
      return;
    }

    try {
      console.log("Creando nota:", newNota);
      await createNota({ ...newNota, valor: valorNumerico });
      setMessage("Nota creada exitosamente.");
      setMessageType("success");

      setNewNota({
        tipo: "",
        valor: "",
        rut: "",
        id_asignatura: asignatura.idAsignatura || ''   
         });

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

  useEffect(() => {
    if (messageType === 'success' || messageType === 'error'|| messageType === 'warning') {
      const timer = setTimeout(() => {
        setMessageType("");
        setMessage("");
      }, 3000); 
  
      return () => clearTimeout(timer); 
    }
  }, [messageType, message]);

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

      {/* Nota */}
      <div className="mb-4">
        <label htmlFor="valor" className="block text-sm text-gray-500 dark:text-gray-300">Nota</label>
        <input
          type="number"
          name="valor"
          value={newNota.valor}
          onChange={handleInputChange}
          placeholder="Ingrese la nota"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Mensaje de error/success */}
      {renderMessage()}

      {/* Botón de enviar */}
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
