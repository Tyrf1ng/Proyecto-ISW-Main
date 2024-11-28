import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { getAlumnosByCurso } from '../services/alumnos.service';
import { createAnotacion } from '@services/anotaciones.service.js';

function Add_anotaciones() {
  const { idCurso } = useContext(CursoContext); // Obtén el curso actual del contexto
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut_alumno: '',
    descripcion: '',
    id_asignatura: idCurso || '',
    fecha: new Date().toISOString(),
  });
  const [message, setMessage] = useState('');
  const [alumnos, setAlumnos] = useState([]); // Siempre inicializa como un array vacío
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar alumnos del curso actual
  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        const alumnosData = await getAlumnosByCurso(idCurso);
        console.log("Datos recibidos de la API:", alumnosData); // Verifica los datos
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
        } else {
          console.error("Formato inesperado de datos:", alumnosData);
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };
  
    cargarAlumnos();
  }, [idCurso]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  // Manejar cambios en el alumno seleccionado
  const handleAlumnoChange = (event, value) => {
    if (value) {
      setSelectedAlumno(value);
      setNewAnotacion({ ...newAnotacion, rut_alumno: value.rut_alumno });
    } else {
      setSelectedAlumno(null);
      setNewAnotacion({ ...newAnotacion, rut_alumno: '' });
    }
  };

  // Enviar la anotación al backend
  const handleSubmit = async () => {
    if (!newAnotacion.rut_alumno) {
      setMessage('Debe seleccionar un alumno.');
      return;
    }
    if (!newAnotacion.descripcion.trim()) {
      setMessage('La descripción no puede estar vacía.');
      return;
    }

    try {
      await createAnotacion(newAnotacion);
      setMessage('Anotación creada exitosamente');
      setNewAnotacion({
        tipo: 'Positiva',
        rut_alumno: '',
        descripcion: '',
        id_asignatura: idCurso || '',
        fecha: new Date().toISOString(),
      });
      setSelectedAlumno(null);
    } catch (error) {
      console.error('Error al crear la anotación:', error);
      setMessage('Hubo un error al crear la anotación');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Añadir Anotaciones</h2>

      {/* Select Tipo de Anotación */}
      <div className="mb-4">
        <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">Tipo de Anotación</label>
        <select
          name="tipo"
          id="tipo"
          value={newAnotacion.tipo}
          onChange={handleSelectChange}
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
        >
          <option value="Positiva">Positiva</option>
          <option value="Negativa">Negativa</option>
        </select>
      </div>

      {/* Autocomplete para seleccionar el alumno */}
      <div className="mb-4">
        <label htmlFor="alumno" className="block text-sm text-gray-500 dark:text-gray-300">Buscar Alumno</label>
        <input
          type="text"
          id="alumno"
          value={selectedAlumno ? `${selectedAlumno.nombre} ${selectedAlumno.apellido}` : ''}
          onChange={e => handleAlumnoChange(e, e.target.value)}
          placeholder="Buscar Alumno"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
        />
      </div>

      {/* Campo de descripción */}
      <div className="mb-4">
        <label htmlFor="descripcion" className="block text-sm text-gray-500 dark:text-gray-300">Descripción</label>
        <textarea
          name="descripcion"
          id="descripcion"
          value={newAnotacion.descripcion}
          onChange={handleInputChange}
          placeholder="Ingrese la descripción"
          rows="4"
          className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
        ></textarea>
      </div>

      {/* Botón con Tailwind CSS */}
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 w-full"
        >
          Guardar Anotación
        </button>
      </div>

      {/* Mensaje de confirmación o error */}
      {message && (
        <div className={`mt-4 text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Add_anotaciones;
