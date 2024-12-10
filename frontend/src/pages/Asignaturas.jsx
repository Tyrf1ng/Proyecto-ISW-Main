import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAsignaturasByAlumno } from "../services/asignatura.service"; 
import { AsignaturaContext } from "../context/AsignaturaContext"; 
import { useAuth } from "../context/AuthContext"; 
import { motion } from "framer-motion"; // Importar motion

const Asignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { setIdAsignatura } = useContext(AsignaturaContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Validar si el usuario tiene rol correcto antes de cargar las asignaturas
    if (!user || (user.rol !== "Docente" && user.rol !== "Alumno")) {
      navigate("/inicio"); 
      return;
    }

    const cargarAsignaturas = async () => {
      if (!user || !user.rut) {
        console.error("El usuario no tiene un RUT asociado.");
        setCargando(false);
        return;
      }
      
      try {
        let asignaturasObtenidas;
        if (user.rol === "Alumno") {
          asignaturasObtenidas = await getAsignaturasByAlumno(user.rut); // Si es alumno
        }

        setAsignaturas(asignaturasObtenidas);
      } catch (error) {
        console.error("Error al cargar asignaturas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarAsignaturas();
  }, [user, navigate]);

  const seleccionarAsignatura = (id_asignatura) => {
    setIdAsignatura(id_asignatura);
    navigate("/inicio"); 
  };

  if (cargando) {
    return <p className="text-center text-xl text-gray-600 dark:text-gray-300">Cargando asignaturas...</p>;
  }

  if (asignaturas.length === 0) {
    return <p className="text-center text-xl text-gray-600 dark:text-gray-300">No hay asignaturas disponibles para este usuario.</p>;
  }

  return (
    <div className="min-h-screen bg-[#1F2937] dark:bg-[#1F2937] p-4">
      <h1 className="text-4xl text-center font-semibold text-white mb-8">Mis Asignaturas</h1>
      <div className="flex flex-col items-center gap-6">
        {asignaturas.map((asignatura) => (
          <motion.div
            key={asignatura.id_asignatura}
            className="w-11/12 sm:w-11/12 md:w-7/10 bg-[#111827] dark:bg-[#111827] p-6 rounded-lg shadow-lg cursor-pointer"
            onClick={() => seleccionarAsignatura(asignatura.id_asignatura)}
            whileHover={{ scale: 1.05 }} // Aumentar tamaño al pasar el ratón
            whileTap={{ scale: 0.95 }}  // Reducir tamaño al hacer clic
            transition={{ type: "spring", stiffness: 400, damping: 20 }} // Transición fluida
          >
            <h2 className="text-xl font-semibold text-white">{asignatura.nombre}</h2>
            <p className="text-md text-gray-400 mt-2">Profesor: {asignatura.profesor || "N/A"}</p>
            <p className="text-sm text-gray-300 mt-2">
              <span className="font-semibold">Código:</span> {asignatura.codigo} - 
              <span className="font-semibold">Nivel:</span> {asignatura.nivel}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Asignaturas;