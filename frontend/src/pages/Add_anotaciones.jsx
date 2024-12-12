import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { AsignaturaContext } from '../context/AsignaturaContext';
import { getSoloAlumnosByCurso } from '@services/cursos.service';
import { createAnotacion } from '@services/anotaciones.service.js';
import Alert from '../components/WarningAlert';

function Add_anotaciones() {
  const { curso } = useContext(CursoContext); // Obtener el curso actual
  const { asignatura } = useContext(AsignaturaContext); // Obtener la asignatura actual
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut: '',
    descripcion: '',
    id_asignatura: asignatura.id_asignatura || '', // Asignar id_asignatura desde el contexto
    fecha: new Date().toISOString(),
  });
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);

  // Estado para manejar los mensajes de la alerta
  const [alert, setAlert] = useState({
    message: '',
    type: '', // 'success', 'error', 'warning'
  });

  useEffect(() => {
    console.log('Contexto asignatura:', asignatura); // Verificar idAsignatura
    console.log('Contexto curso:', curso); // Verificar idCurso
  }, [asignatura, curso]);

  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!curso.idCurso) {
        console.error('ID del curso no válido:', curso.idCurso);
        return;
      }
      try {
        const alumnosData = await getSoloAlumnosByCurso(curso.idCurso);
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData.slice(0, 5));
        } else {
          console.error('Formato inesperado de datos:', alumnosData);
        }
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
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
    // Validaciones antes de crear la anotación
    if (!newAnotacion.rut) {
      setAlert({
        message: 'Debe seleccionar un alumno.',
        type: 'warning',
      });
      return;
    }

    if (!newAnotacion.descripcion.trim()) {
      setAlert({
        message: 'La descripción no puede estar vacía.',
        type: 'warning',
      });
      return;
    }

    try {
      // Intentar crear la anotación
      await createAnotacion(newAnotacion);
      setAlert({
        message: 'Anotación creada exitosamente',
        type: 'success',
      });

      // Limpiar los campos después de crear la anotación
      setNewAnotacion({
        tipo: 'Positiva',
        rut: '',
        descripcion: '',
        id_asignatura: asignatura.id_asignatura || '', // Usar idAsignatura del contexto
        fecha: new Date().toISOString(),
      });
      setSelectedAlumno(null); // Limpiar la selección de alumno
      setSearchTerm(''); // Limpiar el término de búsqueda
      setFilteredAlumnos(alumnos); // Restaurar la lista de alumnos

      // Limpiar la alerta después de 3 segundos
      setTimeout(() => {
        setAlert({
          message: '',
          type: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error al crear la anotación:', error);
      setAlert({
        message: 'Hubo un error al crear la anotación',
        type: 'error',
      });
    }
  };

  const maxDescripcionLength = 280;
  const isMaxReached = newAnotacion.descripcion.length > maxDescripcionLength;

  return (
    <div className="flex py-10 justify-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Añadir Anotación</h2>

        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">Tipo de Anotación</label>
            <select
              name="tipo"
              id="tipo"
              value={newAnotacion.tipo}
              onChange={handleSelectChange}
              className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            >
              <option value="Positiva">Positiva</option>
              <option value="Negativa">Negativa</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="alumno" className="block text-sm text-gray-500 dark:text-gray-300">Buscar Alumno</label>
            <input
              type="text"
              id="alumno"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar Alumno"
              className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
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
            id="descripcion"
            name="descripcion"
            value={newAnotacion.descripcion}
            onChange={handleInputChange}
            maxLength={maxDescripcionLength}
            placeholder="Escribe la descripción"
            rows="4"
            className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
          />
          <small className={`text-sm ${isMaxReached ? 'text-red-500' : 'text-gray-500'}`}>
            {newAnotacion.descripcion.length}/{maxDescripcionLength} caracteres
          </small>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
            Crear Anotación
          </button>
        </div>

        {alert.message && <Alert message={alert.message} type={alert.type} />}
      </div>
    </div>
  );
}

export default Add_anotaciones;
