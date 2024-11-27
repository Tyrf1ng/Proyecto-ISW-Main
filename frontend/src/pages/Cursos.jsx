import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCursosByProfesor } from "../services/cursos.service"; // Importa la función actualizada
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
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
    return <p>Cargando cursos...</p>;
  }

  if (cursos.length === 0) {
    return <p>No hay cursos disponibles para este profesor.</p>;
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#E6EFF8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#133B5C" }}
      >
        Mis cursos
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {cursos.map((curso) => (
          <Paper
            key={curso.id_curso}
            onClick={() => seleccionarCurso(curso.id_curso)}
            sx={{
              width: "80%",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#E3F2FD",
              borderRadius: "8px",
              color: "#133B5C",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#D1E3F5" },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {curso.nombre}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#5C6BC0" }}>
              Coordinador: {curso.coordinador || "N/A"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: 2, color: "#757575" }}
            >
              Código: {curso.codigo} - Nivel: {curso.nivel}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Cursos;
