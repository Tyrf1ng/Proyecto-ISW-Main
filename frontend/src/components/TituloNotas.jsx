
import useUsuario from '../hooks/useUsuario';
import useCursoAsig from '../hooks/UseCursoAsig';

const TituloNotas = () => {
  const { usuario } = useUsuario();
  const { nombreCurso, nombreAsignatura, loading } = useCursoAsig();

  const getTitulo = () => {
    if (loading) {
      return 'Cargando...';
    }

    if (!usuario || !usuario.rol) {
      return 'Notas';
    }

    if (usuario.rol === "Docente") {
      return `Notas para el curso ${nombreCurso}`;
    } else if (usuario.rol === "Alumno") {
      return `Notas en ${nombreAsignatura}`;
    } else {
      return 'Notas';
    }
  };

  return (
    <h1 className="text-4xl font-semibold text-gray-800 dark:text-white mb-10 text-center">
      {getTitulo()}
    </h1>
  );
};

export default TituloNotas;
