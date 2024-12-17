import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/components/books.svg';
import { CursoContext } from '../context/CursoContext';
import { AsignaturaContext } from '../context/AsignaturaContext';
import { getAsignaturasByProfesor } from '../services/asignatura.service';

function Inicio() {
  const navigate = useNavigate();
  const { curso } = useContext(CursoContext);
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', rut: '', rol: '' });
  const { asignatura, setAsignatura } = useContext(AsignaturaContext);
  const [errorAsignatura, setErrorAsignatura] = useState('');
  const [asignaturas, setAsignaturas] = useState(null);
  const [errorCurso, setErrorCurso] = useState('');

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));

    if (usuarioGuardado) {
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        rut: usuarioGuardado.rut,
        rol: usuarioGuardado.rol || ''
      });

      if (usuarioGuardado.rut && usuarioGuardado.rol === 'Docente') {
        getAsignaturasByProfesor(usuarioGuardado.rut)
          .then((asignaturas) => {
            if (asignaturas.length > 0) {
              setAsignaturas(asignaturas);
              setAsignatura(asignaturas[0] ? {
                idAsignatura: asignaturas[0].id_asignatura,
                nombre: asignaturas[0].nombre,
                rut: asignaturas[0].rut,
                createdAt: asignaturas[0].createdAt,
                updatedAt: asignaturas[0].updatedAt,
              } : asignaturas[0]);
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
  }, [setAsignatura]);

  const handleSeleccionarAsignatura = () => {
    navigate('/asignaturas');
  };

  const handleSeleccionarCurso = () => {
    navigate('/cursos');
  };

  return (
    <div className="flex items-center justify-center px-20 min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="overflow-hidden bg-white dark:bg-gray-900 lg:mx-8 lg:flex lg:max-w-6xl lg:w-full lg:shadow-md lg:rounded-xl">
        <div className="lg:w-1/2">
          <div
            className="h-64 bg-cover lg:h-full"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
        </div>

        <div className="max-w-xl px-6 py-10 my-20 lg:max-w-5xl lg:w-1/2 flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Bienvenido, <span className="text-blue-500">{usuario.nombre} {usuario.apellido}</span>
          </h2>

          <p className="text-lg text-gray-500 dark:text-gray-300">
            {usuario.rol === 'Alumno' ? (
              <span>
                Bienvenido a tu página personal del liceo.  <br />
                <span className="text-[#3B82F6]"></span>
                {errorAsignatura ? (
                  <span className="text-red-500">{errorAsignatura}</span>
                ) : (
                  <span>
                    Bienvenido a tu página de la asignatura{' '}
                    <span className="text-[#3B82F6]">
                      {asignatura && asignatura.nombre ? asignatura.nombre : 'Cargando asignatura...'}
                    </span>
                  </span>
                )}
              </span>
            ) : usuario.rol === 'Docente' ? (
              <>
                {errorAsignatura ? (
                  <span className="text-red-500">{errorAsignatura}</span>
                ) : (
                  <span>
                    Bienvenido a tu página de la asignatura {' '} 
                    <span className="text-[#3B82F6]">
                      {asignatura && asignatura.nombre ? asignatura.nombre : 'Cargando asignatura...'}
                    </span>
                  </span>
                )}
                {errorCurso || !curso.idCurso ? (
                  <span className="text-red-500">{errorCurso || 'No has seleccionado un curso.'}</span>
                ) : (
                  <span>
                    <br /> y el curso seleccionado es{' '}
                    <span className="text-[#3B82F6]">
                      {curso.nombre ? curso.nombre : 'Cargando curso...'}
                    </span>.
                  </span>
                )}
              </>
            ) : usuario.rol === 'Directivo' ? (
              <span>
                Bienvenido a la página de administración del liceo{' '}
                <span className="text-[#3B82F6]">XXXXXXXXX</span>. <br />
                Desde aquí puedes gestionar los recursos educativos y coordinar con los profesores y alumnos.
              </span>
            ) : usuario.rol === 'Encargado de Laboratorio' ? (
              <span>
                Bienvenido a la página de administración de las reservas, laboratorios y horarios.
              </span>
            ) : (
              <span>Rol no reconocido</span>
            )}
          </p>

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