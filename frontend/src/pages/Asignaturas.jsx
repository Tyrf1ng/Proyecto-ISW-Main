import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAsignaturasByAlumno } from "../services/asignatura.service"; 
import { AsignaturaContext } from "../context/AsignaturaContext"; 
import { useAuth } from "../context/AuthContext"; 
import { motion } from "framer-motion"; 

const Asignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { setAsignatura } = useContext(AsignaturaContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user ||user.rol !== "Alumno") {
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
        const asignaturasObtenidas = await getAsignaturasByAlumno(user.rut)
        setAsignaturas(asignaturasObtenidas);
      } catch (error) {
        console.error("Error al cargar asignaturas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarAsignaturas();
  }, [user, navigate]);

  const seleccionarAsignatura = (id_asignatura, nombre) => {
    setAsignatura({ idAsignatura:id_asignatura, nombre: nombre });
    navigate("/inicio"); 
  };

  if (cargando) {
    return <p className="text-center text-xl text-gray-600 dark:text-gray-300">Cargando asignaturas...</p>;
  }

  if (asignaturas.length === 0) {
    return <p className="text-center text-xl text-gray-600 dark:text-gray-300">No hay asignaturas disponibles para este usuario.</p>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1F2937] p-4">
      <h1 className="text-4xl text-center font-semibold text-black dark:text-white mb-12">
        Mis Asignaturas</h1>
      <div className="flex flex-col items-center gap-6">
        {asignaturas.map((asignatura) => (
          <motion.div
            key={asignatura.id_asignatura}
            className="w-11/12 sm:w-11/12 md:w-7/10  bg-gray-300 dark:bg-[#111827] p-6 rounded-lg shadow-lg cursor-pointer"
            onClick={() => seleccionarAsignatura(asignatura.id_asignatura,asignatura.nombre)}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}  
            transition={{ type: "spring", stiffness: 400, damping: 20 }} 
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">{asignatura.nombre}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Profesor: {asignatura.profesor || "N/A"}</p>
            <p className="text-sm text-gray-300 mt-2">
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Asignaturas;