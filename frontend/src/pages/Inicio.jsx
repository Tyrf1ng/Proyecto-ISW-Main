import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/components/books.svg'; // Imagen local
import { CursoContext } from '../context/CursoContext'; // Importación del contexto de curso
import { getAsignaturasByProfesor } from '../services/asignatura.service'; // Importación del servicio de asignaturas

function Inicio() {
  const navigate = useNavigate();
  const { curso } = useContext(CursoContext); 
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', rut: '', rol: '' });
  const [asignatura, setAsignatura] = useState('Cargando asignatura...'); // Valor inicial
  const [errorAsignatura, setErrorAsignatura] = useState(''); 
  const [errorCurso, setErrorCurso] = useState(''); 

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    console.log('Usuario cargado desde sessionStorage:', usuarioGuardado);  // Verificar los datos cargados

    if (usuarioGuardado) {
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        rut: usuarioGuardado.rut, 
        rol: usuarioGuardado.rol || ''  
      });

      // Obtener las asignaturas del profesor solo si el usuario es un profesor
      if (usuarioGuardado.rut && usuarioGuardado.rol === 'Docente') {
        getAsignaturasByProfesor(usuarioGuardado.rut)
          .then((asignaturas) => {
            console.log('Asignaturas obtenidas:', asignaturas);  // Verificar las asignaturas obtenidas
            if (asignaturas.length > 0) {
              const asignaturaSeleccionada = asignaturas[0]; // Tomamos la primera asignatura
              setAsignatura(asignaturaSeleccionada.nombre);  // Actualizamos el estado
            } else {
              setErrorAsignatura('No se encontraron asignaturas para este profesor.');
            }
          })
          .catch((error) => {
            console.error('Error al obtener asignaturas:', error);
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
            ) : usuario.rol === 'Docente' ? (
              // Texto para profesores
              <>
                {errorAsignatura ? (
                  <span className="text-red-500">{errorAsignatura}</span>
                ) : (
                  <span>
                    Bienvenido a tu página de la asignatura <span className="text-[#3B82F6]">{asignatura} </span>
                  </span>
                )}
                {errorCurso || !curso.idCurso ? (
                  <span className="text-red-500">{errorCurso || 'No has seleccionado un curso.'}</span>
                ) : (
                  <span>
                    y el curso seleccionado es  <span className="text-[#3B82F6]">{curso.nombre || 'Cargando curso...'}</span>.
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
          {usuario.rol === 'Docente' && (
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
