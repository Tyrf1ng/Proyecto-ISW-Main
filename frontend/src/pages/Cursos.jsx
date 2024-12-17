import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCursosByProfesor } from "../services/cursos.service";
import { CursoContext } from "../context/CursoContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { setCurso } = useContext(CursoContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.rol !== "Docente") {
      navigate("/inicio");
      return;
    }

    const cargarCursos = async () => {
      if (!user || !user.rut) {
        console.error("El usuario no tiene un RUT asociado.");
        setCargando(false);
        return;
      }
      try {
        const cursosObtenidos = await getCursosByProfesor(user.rut);
        setCursos(cursosObtenidos);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarCursos();
  }, [user, navigate]);

  const seleccionarCurso = (id_curso, nombre) => {
    setCurso({ idCurso: id_curso, nombre: nombre });
    navigate("/inicio");
  };

  if (cargando) {
    return (
      <p className="text-center text-xl text-gray-600 dark:text-gray-300">
        Cargando cursos...
      </p>
    );
  }

  if (cursos.length === 0) {
    return (
      <p className="text-center text-xl text-gray-600 dark:text-gray-300">
        No hay cursos disponibles para este profesor.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1F2937] p-4 ">
      <h1 className="text-4xl text-center font-semibold text-black dark:text-white mb-12">
        Mis Cursos
      </h1>
      <div className="flex flex-col items-center gap-6">
        {cursos.map((curso) => (
          <motion.div
            key={curso.id_curso}
            className="w-11/12 sm:w-11/12 md:w-7/10  bg-gray-300 dark:bg-[#111827] p-6 rounded-lg shadow-lg cursor-pointer"
            onClick={() => seleccionarCurso(curso.id_curso, curso.nombre)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">{curso.nombre}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              <span className="font-semibold">Nivel:</span> {curso.nivel}<br />
              <span className="font-semibold">Año:</span> {curso.año && curso.año.split("-")[0]}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
