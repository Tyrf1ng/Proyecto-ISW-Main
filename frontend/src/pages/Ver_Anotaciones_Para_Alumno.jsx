import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { getAnotacionesAlumno } from '@services/anotaciones.service'; // Servicio para obtener anotaciones por RUT
import TableAnotacionComponent from '../components/Table'; // Importa el componente Table

const Ver_Anotaciones_Para_Alumno = () => {
  const [anotaciones, setAnotaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [rut, setRut] = useState('');
  const [role, setRole] = useState(''); // Estado para el rol

  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setRut(usuarioGuardado.rut);
      setRole(usuarioGuardado.role); // Suponiendo que el rol también está en sessionStorage
      cargarAnotaciones(usuarioGuardado.rut);
    }
  }, []);

  const cargarAnotaciones = async (rut) => {
    try {
      const datosAnotaciones = await getAnotacionesAlumno(rut);
      setAnotaciones(datosAnotaciones || []); // Asegúrate de asignar un array vacío si no hay datos
    } catch (error) {
      console.error('Error al cargar las anotaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Aquí solo pasas las anotaciones, el rol y el rut */}
      <TableAnotacionComponent
        anotaciones={anotaciones} // Pasa todas las anotaciones sin filtrar
        role={role} // Pasa el rol al componente de tabla
        rut={rut} // Pasa el RUT al componente de tabla
      />
    </Box>
  );
};

export default Ver_Anotaciones_Para_Alumno;
