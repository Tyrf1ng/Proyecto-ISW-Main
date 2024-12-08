import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { getAlumnosByCurso } from '../services/alumnos.service';
import { createAnotacion } from '@services/anotaciones.service.js';


function Add_anotaciones() {
    const { curso } = useContext(CursoContext);
    const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut: '',
    descripcion: '',
    id_asignatura: curso.idCurso || '',  // Usar curso.id en lugar de idCurso
    fecha: new Date().toISOString(),
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);

  // Cargar alumnos cuando se monta el componente o cambia curso.idCurso
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!curso.idCurso) {  // Comprobar si el curso tiene un idCurso válido
        console.error("ID del curso no válido:", curso.idCurso);
        return;
      }
      try {
        const alumnosData = await getAlumnosByCurso(curso.idCurso);  // Obtener alumnos según curso.idCurso
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData.slice(0, 5)); // Mostrar solo los primeros 5 alumnos
        } else {
          console.error("Formato inesperado de datos:", alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };

    cargarAlumnos();
  }, [curso.idCurso]);  // Dependencia de curso.idCurso para recargar los alumnos cuando cambie

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    
    // Filtrar alumnos basados en la búsqueda
    const filtered = alumnos.filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(query)
    );

    // Limitar a los primeros 5 resultados
    setFilteredAlumnos(filtered.slice(0, 5));
    setIsListVisible(filtered.length > 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  const handleAlumnoSelect = (alumno) => {
    setSelectedAlumno(alumno);
    setNewAnotacion({ ...newAnotacion, rut: alumno.rut });
    setSearchTerm(`${alumno.nombre} ${alumno.apellido}`);
    setIsListVisible(false);
  };

  const handleSubmit = async () => {
    if (!newAnotacion.rut) {
      setMessage('Debe seleccionar un alumno.');
      setMessageType('warning');
      return;
    }
    if (!newAnotacion.descripcion.trim()) {
      setMessage('La descripción no puede estar vacía.');
      setMessageType('warning');
      return;
    }

    try {
      // Crear la anotación con la información actual
      await createAnotacion(newAnotacion);
      setMessage('Anotación creada exitosamente');
      setMessageType('success');
      setNewAnotacion({
        tipo: 'Positiva',
        rut: '',
        descripcion: '',
        id_asignatura: curso.idCurso || '', // Volver a establecer el curso.idCurso para futuras anotaciones
        fecha: new Date().toISOString(),
      });
      setSelectedAlumno(null);
      setFilteredAlumnos(alumnos);
    } catch (error) {
      console.error('Error al crear la anotación:', error);
      setMessage('Hubo un error al crear la anotación');
      setMessageType('error');
    }
  };

  const renderMessage = () => {
    const messageClasses = "fixed top-5 right-5 w-full max-w-sm overflow-hidden bg-[#111827] rounded-lg shadow-md z-50 animate-bounce-slow";

    if (messageType === 'success') {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-emerald-500">Success</span>
              <p className="text-sm text-gray-100">{message}</p>
            </div>
          </div>
        </div>
      );
    }

    if (messageType === 'error') {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-red-500">Error</span>
              <p className="text-sm text-gray-100">{message}</p>
            </div>
          </div>
        </div>
      );
    }

    if (messageType === 'warning') {
      return (
        <div className={messageClasses}>
          <div className="px-4 py-2 -mx-3">
            <div className="mx-3">
              <span className="font-semibold text-yellow-400">Warning</span>
              <p className="text-sm text-gray-100">{message}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Añadir Anotaciones</h2>

      <div className="mb-4">
        <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">Tipo de Anotación</label>
        <select
          name="tipo"
          id="tipo"
          value={newAnotacion.tipo}
          onChange={handleSelectChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        >
          <option value="Positiva">Positiva</option>
          <option value="Negativa">Negativa</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="alumno" className="block text-sm text-gray-500 dark:text-gray-300">Buscar Alumno</label>
        <input
          type="text"
          id="alumno"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar Alumno"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      {isListVisible && filteredAlumnos.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto">
          <ul className="mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
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
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-sm text-gray-500 dark:text-gray-300">Descripción</label>
        <textarea
          name="descripcion"
          id="descripcion"
          value={newAnotacion.descripcion}
          onChange={handleInputChange}
          placeholder="Ingrese la descripción"
          rows="4"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
        ></textarea>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 w-full"
        >
          Guardar Anotación
        </button>
      </div>

      {renderMessage()}
    </div>
  );
}

export default Add_anotaciones;
