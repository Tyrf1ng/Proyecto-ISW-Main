import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCursosByProfesor } from "../services/cursos.service"; // Importa la función actualizada
import { CursoContext } from "../context/CursoContext"; // Contexto de cursos
import { useAuth } from "../context/AuthContext"; // Contexto de autenticación

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { setIdCurso } = useContext(CursoContext); // Contexto de cursos
  const { user } = useAuth(); // Contexto de autenticación
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCursos = async () => {
      if (!user || !user.rut) {
        console.error("El usuario no tiene un RUT asociado.");
        setCargando(false);
        return;
      }
      try {
        const cursosObtenidos = await getCursosByProfesor(user.rut); // Usa el RUT del profesor
        setCursos(cursosObtenidos);
        console.log("Cursos obtenidos:", cursosObtenidos);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarCursos();
  }, [user]);

  const seleccionarCurso = (id_curso) => {
    setIdCurso(id_curso); // Establece el ID del curso seleccionado en el contexto
    navigate("/inicio"); // Redirige a la página principal o Dashboard
  };

  if (cargando) {
    return <p className="text-center text-xl text-gray-600 dark:text-gray-300">Cargando cursos...</p>;
  }

  if (cursos.length === 0) {
    return <p className="text-center text-xl text-gray-600 dark:text-gray-300">No hay cursos disponibles para este profesor.</p>;
  }

  return (
    <div className="bg-[#1F2937] dark:bg-[#1F2937] min-h-screen p-4">
      <h1 className="text-4xl text-center font-semibold text-white mb-8">Mis Cursos</h1>
      
      <div className="flex flex-col items-center gap-6">
        {cursos.map((curso) => (
          <div
            key={curso.id_curso}
            className="w-11/12 sm:w-11/12 md:w-7/10 bg-[#111827] dark:bg-[#111827] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-[#374151] dark:hover:bg-[#4B5563] transform transition duration-300 ease-in-out"
            onClick={() => seleccionarCurso(curso.id_curso)}
          >
            <h2 className="text-xl font-semibold text-white">{curso.nombre}</h2>
            <p className="text-md text-gray-400 mt-2">Coordinador: {curso.coordinador || "N/A"}</p>
            <p className="text-sm text-gray-300 mt-2">
              <span className="font-semibold">Código:</span> {curso.codigo} - 
              <span className="font-semibold"> Nivel:</span> {curso.nivel}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
