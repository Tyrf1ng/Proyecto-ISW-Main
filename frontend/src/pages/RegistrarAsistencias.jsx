import { useState, useContext, useEffect } from "react";
import { createAsistencia } from "../services/Asistencias.service";
import { getAlumnosByCurso } from "../services/alumnos.service";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { CursoContext } from "../context/CursoContext";

const RegistrarAsistencias = () => {
  const { idCurso } = useContext(CursoContext);
  useEffect(() => {
    console.log("id_curso proporcionado por CursoContext:", idCurso);
  }, [idCurso]);
  
  const [estado, setEstado] = useState("");
  const [observacion, setObservacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!idCurso) {
        console.error("ID del curso no válido:", idCurso);
        return;
      }
      try {
        setLoading(true);
        const alumnosData = await getAlumnosByCurso(idCurso);
        setAlumnos(alumnosData || []);
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAlumnos();
  }, [idCurso]);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlumno) {
      setMensaje("Debe seleccionar un alumno.");
      return;
    }
    try {
      const data = {
        id_asignatura: idCurso,
        rut_alumno: selectedAlumno.rut_alumno,
        tipo: estado,
        observacion: estado === "Justificado" ? observacion : null,
      };


    console.log("Datos enviados al backend:", data);

      await createAsistencia(data);
      setMensaje("¡Asistencia registrada exitosamente!");
      setSelectedAlumno(null);
      setEstado("");
      setObservacion("");
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      setMensaje("Hubo un error al registrar la asistencia.");
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#133B5C" }}
      >
        Registrar Asistencia
      </Typography>
      <form onSubmit={manejarSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Autocomplete
            options={alumnos}
            getOptionLabel={(option) =>
              `${option.nombre} ${option.apellido} (${option.rut_alumno})`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Alumno"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            onChange={(event, value) => setSelectedAlumno(value)}
            value={selectedAlumno}
            noOptionsText="No se encontraron alumnos"
            loading={loading}
          />
          <FormControl required>
            <Select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              displayEmpty
              sx={{
                color: "#E6EFF8", // Cambia este color para igualarlo al texto del RUT
                "& .MuiSelect-select": {
                  color: "#E6EFF8", // Color del texto seleccionado
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#133B5C", // Color del borde
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E6EFF8", // Borde al pasar el mouse
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E6EFF8", // Borde al enfocarse
                },
                "& .MuiSvgIcon-root": {
                  color: "#E6EFF8", // Color del ícono desplegable
                },
              }}
            >
              <MenuItem value="" disabled>
                Estado
              </MenuItem>
              <MenuItem value="Presente">Presente</MenuItem>
              <MenuItem value="Ausente">Ausente</MenuItem>
              <MenuItem value="Justificado">Justificado</MenuItem>
            </Select>
          </FormControl>
          {estado === "Justificado" && (
            <TextField
              label="Observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              InputProps={{
                style: { color: "#133B5C" },
              }}
              InputLabelProps={{
                style: { color: "#133B5C" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#133B5C",
                  },
                  "&:hover fieldset": {
                    borderColor: "#133B5C",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#133B5C",
                  },
                },
              }}
            />
          )}
          <Button type="submit" variant="contained" color="primary">
            Registrar
          </Button>
        </Box>
      </form>
      {mensaje && (
        <Typography
          variant="h6"
          align="center"
          sx={{ marginTop: 2, color: "#133B5C" }}
        >
          {mensaje}
        </Typography>
      )}
    </Box>
  );
};

export default RegistrarAsistencias;
