// src/components/TituloAnotaciones.jsx
import useUsuario from '../hooks/useUsuario';
import useCursoAsig from '../hooks/UseCursoAsig';

const TituloAnotaciones = () => {
  const { usuario } = useUsuario();
  const { nombreCurso, nombreAsignatura, loading } = useCursoAsig();

  const getTitulo = () => {
    if (loading) {
      return 'Cargando...';
    }

    if (!usuario || !usuario.rol) {
      return 'Anotaciones';
    }

    if (usuario.rol === "Docente") {
      return `Anotaciones para el curso ${nombreCurso}`;
    } else if (usuario.rol === "Alumno") {
      return `Anotaciones en ${nombreAsignatura}`;
    } else {
      return 'Anotaciones';
    }
  };

  return (
    <h1 className="text-4xl font-semibold text-gray-800 dark:text-white mb-10 text-center">
      {getTitulo()}
    </h1>
  );
};

export default TituloAnotaciones;
