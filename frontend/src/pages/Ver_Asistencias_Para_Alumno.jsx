import { useState, useEffect } from "react";
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
import { getAsistenciasPorAlumno } from "../services/Asistencias.service"; // Asegúrate de que este servicio esté implementado

const Ver_Asistencias_Para_Alumno = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [cargando, setCargando] = useState(true);
  const [rut, setRut] = useState("");

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem("usuario"));
    if (usuarioGuardado && usuarioGuardado.rut) {
      setRut(usuarioGuardado.rut);
      cargarAsistencias(usuarioGuardado.rut);
    }
  }, []);

  const cargarAsistencias = async (rutAlumno) => {
    try {
      const datosAsistencias = await getAsistenciasPorAlumno(rutAlumno);
      setAsistencias(datosAsistencias || []); // Asegurarse de que los datos se asignen correctamente
    } catch (error) {
      console.error("Error al cargar las asistencias:", error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar asistencias según el texto ingresado
  const filteredAsistencias = asistencias.filter((asistencia) =>
    asistencia.tipo.toLowerCase().includes(filterText.toLowerCase())
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
        Asistencias del Alumno
      </Typography>
      <Typography variant="h6" gutterBottom>
        RUT: {rut}
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
          label="Filtrar por estado"
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
                  <TableCell>{asistencia.tipo}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No hay asistencias registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ver_Asistencias_Para_Alumno;
