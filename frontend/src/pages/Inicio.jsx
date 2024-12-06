import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/components/books.svg'; // Imagen local
import { getAsignaturasByProfesor } from '../services/asignatura.service'; // Importación del servicio de asignaturas
import { getCursosByProfesor } from '../services/cursos.service'; // Importación del servicio de cursos
import { getAsignaturasByAlumno } from '../services/asignatura.service'; // Importación del servicio para asignaturas de alumno

function Inicio() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', rut: '', rol: '' });
  const [asignatura, setAsignatura] = useState('');
  const [curso, setCurso] = useState('');
  const [errorAsignatura, setErrorAsignatura] = useState(''); // Para manejar errores de asignatura
  const [errorCurso, setErrorCurso] = useState(''); // Para manejar errores del curso

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        rut: usuarioGuardado.rut, 
        rol: usuarioGuardado.rol || ''  // Asegurarse de que el rol esté disponible
      });
  

      // Obtener las asignaturas del profesor
      if (usuarioGuardado.rut && usuarioGuardado.rol === 'Profesor') {
        getAsignaturasByProfesor(usuarioGuardado.rut)
          .then((asignaturas) => {
            if (asignaturas.length > 0) {
              const asignaturaSeleccionada = asignaturas[0]; // Selecciona la primera asignatura si hay varias
              setAsignatura(asignaturaSeleccionada.nombre);
            } else {
              setErrorAsignatura('No se encontraron asignaturas para este profesor.');
            }
          })
          .catch((error) => {
            console.error('Error al obtener asignaturas:', error);
            setErrorAsignatura('Hubo un error al cargar las asignaturas.');
          });

        // Obtener los cursos del profesor
        getCursosByProfesor(usuarioGuardado.rut)
          .then((cursos) => {
            if (cursos.length > 0) {
              setCurso(cursos[0].nombre);  // Asignamos el nombre del primer curso
            } else {
              setErrorCurso('No se encontraron cursos para este profesor.');
            }
          })
          .catch((error) => {
            console.error('Error al obtener cursos:', error);
            setErrorCurso('Hubo un error al cargar los cursos.');
          });
      } else if (usuarioGuardado.rol === 'Alumno') {
        // Obtener las asignaturas del alumno
        getAsignaturasByAlumno(usuarioGuardado.rut)
          .then((asignaturas) => {
            if (asignaturas.length > 0) {
              setAsignatura(asignaturas[0].nombre); // Selecciona la primera asignatura si hay varias
            } else {
              setErrorAsignatura('No se encontraron asignaturas para este alumno.');
            }
          })
          .catch((error) => {
            console.error('Error al obtener asignaturas por alumno:', error);
            setErrorAsignatura('Hubo un error al cargar las asignaturas.');
          });
      }
    }
  }, []);

  const handleSeleccionarAsignatura = () => {
    navigate('/asignaturas'); // Redirige a la página de selección de asignaturas
  };

  const handleSeleccionarCurso = () => {
    navigate('/cursos'); // Redirige a la página de selección de cursos
  };

  return (
    <div className="flex items-center justify-center px-20 min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="overflow-hidden bg-white dark:bg-gray-900 lg:mx-8 lg:flex lg:max-w-6xl lg:w-full lg:shadow-md lg:rounded-xl">
        {/* Imagen de fondo local */}
        <div className="lg:w-1/2">
          <div
            className="h-64 bg-cover lg:h-full"
            style={{ backgroundImage: `url(${backgroundImage})` }}  // Usando la imagen local
          >
            {/* Puedes agregar algún contenido adicional sobre la imagen si es necesario */}
          </div>
        </div>

        {/* Información del usuario */}
        <div className="max-w-xl px-6 py-10 my-20 lg:max-w-5xl lg:w-1/2 flex flex-col justify-center space-y-6"> {/* Ajuste aquí */}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Bienvenido, <span className="text-blue-500">{usuario.nombre} {usuario.apellido}</span>
          </h2>

          {/* Texto condicional dependiendo del rol */}
          <p className="text-lg text-gray-500 dark:text-gray-300">
            {usuario.rol === 'Alumno' ? (
              // Texto para alumnos
              <span>
                Bienvenido a tu página personal del liceo 
                 <span className="text-[#3B82F6]"> XXXXXXXXX <br />
                 </span>
                {errorAsignatura ? (
                  <span className="text-red-500">{errorAsignatura}</span>
                ) : (
                  <span>
                     Tu asignatura seleccionada es <span className="text-[#3B82F6]">{asignatura|| 'Cargando asignatura...'}</span>
                  </span>
                )}
              </span>
            ) : usuario.rol === 'Profesor' ? (
              // Texto para profesores
              <>
                {errorAsignatura ? (
                  <span className="text-red-500">{errorAsignatura}</span>
                ) : (
                  <span>
                    Bienvenido a tu página de la asignatura <span className="text-[#3B82F6]">{asignatura || 'Cargando asignatura...'} </span>
                  </span>
                )}
                {errorCurso ? (
                  <span className="text-red-500">{errorCurso}</span>
                ) : (
                  <span>
                    y el curso seleccionado es  <span className="text-[#3B82F6]">{curso || 'Cargando curso...'}</span>.
                  </span>
                )}
              </>
            ) : usuario.rol === 'Directivo' ? (
              // Texto para directivos
              <span>
                Bienvenido a la página de administración del liceo <span className="text-[#3B82F6]">XXXXXXXXX</span>.<br />
                Desde aquí puedes gestionar los recursos educativos y coordinar con los profesores y alumnos.
              </span>
            ) : (
              <span>Rol no reconocido</span>
            )}
          </p>

          {/* Botones para seleccionar asignatura o curso */}
          {usuario.rol === 'Alumno' && (
            <div className="inline-flex w-full mt-6 sm:w-auto">
              <button
                onClick={handleSeleccionarAsignatura}
                className="inline-flex items-center justify-center w-full px-6 py-2 text-sm text-white duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              >
                Seleccionar asignatura
              </button>
            </div>
          )}

          {usuario.rol === 'Profesor' && (
            <div className="inline-flex w-full mt-6 sm:w-auto">
              <button
                onClick={handleSeleccionarCurso}
                className="inline-flex items-center justify-center w-full px-6 py-2 text-sm text-white duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              >
                Volver a seleccionar un curso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inicio;
