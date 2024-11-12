import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCursos } from "../services/cursos.service";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { CursoContext } from "../context/CursoContext"; // Importa el contexto

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { setIdCurso } = useContext(CursoContext); // Usa el contexto
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const cursosObtenidos = await getCursos();
        setCursos(cursosObtenidos);
        console.log("Cursos obtenidos:", cursosObtenidos);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarCursos();
  }, []);

  const seleccionarCurso = (id_curso) => {
    setIdCurso(id_curso); // Establece el ID del curso seleccionado en el contexto
    navigate("/inicio"); // Redirige al Dashboard o a la página principal
  };

  if (cargando) {
    return <p>Cargando cursos...</p>;
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
            onClick={() => seleccionarCurso(curso.id_curso)} // Hacer clic para seleccionar el curso
            sx={{
              width: "80%",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#E3F2FD",
              borderRadius: "8px",
              color: "#133B5C",
              cursor: "pointer", // Cambia el cursor para indicar que es clickeable
              "&:hover": { backgroundColor: "#D1E3F5" }, // Efecto hover
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {curso.nombre}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#5C6BC0" }}>
              Coordinador: [Nombre del Coordinador]
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
