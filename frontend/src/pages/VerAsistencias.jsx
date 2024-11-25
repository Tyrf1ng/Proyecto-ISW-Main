import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { CursoContext } from "../context/CursoContext"; // Importa el contexto
import { getAsistenciasCurso } from "../services/Asistencias.service"; // Importar el servicio

const VerAsistencias = () => {
  const { idCurso } = useContext(CursoContext);
  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAsistencias = async () => {
      try {
        const datosAsistencias = await getAsistenciasCurso(idCurso);
        setAsistencias(datosAsistencias || []); // Asegurarse de que los datos se asignen correctamente
      } catch (error) {
        console.error("Error al cargar las asistencias:", error);
      } finally {
        setCargando(false);
      }
    };
    console.log("id_curso proporcionado por CursoContext:", idCurso);
    cargarAsistencias();
  }, [idCurso]);

  // Filtrar asistencias según el texto ingresado
  const filteredAsistencias = asistencias.filter((asistencia) =>
    `${asistencia.alumno.nombre} ${asistencia.alumno.apellido}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  if (cargando) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Asistencias {idCurso ? `del Curso: ${idCurso}` : ""}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <TextField
          label="Filtrar por nombre"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Nombre del Alumno</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAsistencias.length > 0 ? (
              filteredAsistencias.map((asistencia, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(asistencia.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {asistencia.alumno.nombre} {asistencia.alumno.apellido}
                  </TableCell>
                  <TableCell>{asistencia.rut_alumno}</TableCell>
                  <TableCell>{asistencia.tipo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay asistencias registradas para este curso.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VerAsistencias;
