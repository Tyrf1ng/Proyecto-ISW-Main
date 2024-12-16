import useUsuario from '../hooks/useUsuario';
import useCursoAsig from '../hooks/UseCursoAsig';
import { Outlet } from 'react-router-dom';

function Anotaciones() {
  const { usuario } = useUsuario();
  const { nombreCurso, nombreAsignatura, loading } = useCursoAsig();

  const getTitulo = () => {
    if (loading) {
      return 'Cargando...';
    }

    if (!usuario || usuario.rol === undefined || usuario.rol === null) {
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
    <div className="px-4 bg-gray-100 dark:bg-[#1F2937] min-h-screen">
      <div className="text-center mt-12">
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
          {getTitulo()}
        </h3>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Anotaciones;
