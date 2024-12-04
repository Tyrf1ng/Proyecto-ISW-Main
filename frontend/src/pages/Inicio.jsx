import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import backgroundImage from '../images/components/books.svg'; // Imagen local
import { getAsignaturasByProfesor } from '../services/asignatura.service'; // Importación del servicio

function Inicio() {
  const navigate = useNavigate();
  const [rolUsuario, setRolUsuario] = useState('');
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', rut: '' });
  const [asignatura, setAsignatura] = useState('');
  const [curso, setCurso] = useState('');
  const [errorAsignatura, setErrorAsignatura] = useState(''); // Para manejar errores de asignatura

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setRolUsuario(usuarioGuardado.rol);
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        rut: usuarioGuardado.rut, // Extraer el RUT del usuario
      });
      console.log('Datos del usuario:', usuarioGuardado);

      // Obtener las asignaturas del profesor
      if (usuarioGuardado.rut) {
        getAsignaturasByProfesor(usuarioGuardado.rut)
          .then((asignaturas) => {
            if (asignaturas.length > 0) {
              // Aquí puedes asumir que el profesor tiene al menos una asignatura
              const asignaturaSeleccionada = asignaturas[0]; // Si hay varias, selecciona la que corresponda
              setAsignatura(asignaturaSeleccionada.nombre);  // Asignatura seleccionada
              setCurso(asignaturaSeleccionada.curso); // Curso relacionado
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

  const handleSeleccionarCurso = () => {
    navigate('/cursos'); // Redirige a la página de selección de cursos
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
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
        <div className="max-w-xl px-6 py-12 lg:max-w-5xl lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Bienvenido, <span className="text-blue-500">{usuario.nombre} {usuario.apellido}</span>
          </h2>

          <p className="mt-4 text-gray-500 dark:text-gray-300">
            {errorAsignatura ? (
              <span className="text-red-500">{errorAsignatura}</span>
            ) : (
              `Bienvenido a tu página de la asignatura: ${asignatura || 'Cargando asignatura...'}, del curso: ${curso || 'Cargando curso...'}.`
            )}
          </p>

          {/* Datos del usuario */}
          <div className="mt-4 dark:text-white">
            <Typography variant="h6">
              {rolUsuario ? `Rol: ${rolUsuario}` : 'Cargando rol...'}
            </Typography>
            <Typography variant="h6">
              {usuario.rut ? `RUT: ${usuario.rut}` : 'Cargando RUT...'}
            </Typography>
          </div>

          {/* Botón para seleccionar un curso */}
          <div className="inline-flex w-full mt-6 sm:w-auto">
            <button
              onClick={handleSeleccionarCurso}
              className="inline-flex items-center justify-center w-full px-6 py-2 text-sm text-white duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
              Volver a seleccionar un curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
