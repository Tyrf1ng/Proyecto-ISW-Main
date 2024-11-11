import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAsistenciasCurso } from "../services/Asistencias.service"; // Importar el servicio adecuado
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns"; // Importar date-fns

const VerAsistencias = () => {
  const { id_curso } = useParams();
  console.log("id_curso:", id_curso);
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAsistencias = async () => {
      try {
        const datosAsistencias = await getAsistenciasCurso(id_curso);
        setAsistencias(datosAsistencias || []); // Asegurarse de que los datos se asignen correctamente
      } catch (error) {
        console.error("Error al cargar las asistencias:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarAsistencias();
  }, [id_curso]);

  if (cargando) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: "#E6EFF8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#133B5C" }}
      >
        Asistencias del Curso
      </Typography>
      {asistencias.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: "#133B5C" }}>
          No hay asistencias registradas para este curso.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {asistencias.map((asistencia, index) => (
            <Paper
              key={index}
              sx={{
                padding: 2,
                backgroundColor: "#BBDEFB",
                borderRadius: "8px",
                color: "#133B5C",
              }}
            >
              <Typography variant="body1">
                Fecha:{" "}
                {format(new Date(asistencia.createdAt), "dd/MM/yyyy HH:mm")} -
                {asistencia.alumno.nombre} {asistencia.alumno.apellido} - Rut:{" "}
                {asistencia.rut_alumno} - Estado: {asistencia.tipo}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default VerAsistencias;
