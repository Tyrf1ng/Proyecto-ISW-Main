
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { getCursos } from '../services/cursos.service';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

function Anotaciones() {
    const { idCurso } = useContext(CursoContext);
    const [nombreCurso, setNombreCurso] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarNombreCurso = async () => {
            try {
                setLoading(true);
                const cursos = await getCursos();
                const cursoSeleccionado = cursos.find((curso) => curso.id_curso === idCurso);
                if (cursoSeleccionado) {
                    setNombreCurso(cursoSeleccionado.nombre);
                } else {
                    setNombreCurso('Curso no encontrado');
                }
            } catch (error) {
                console.error("Error al obtener el nombre del curso:", error);
                setNombreCurso('Error al cargar curso');
            } finally {
                setLoading(false);
            }
        };

        if (idCurso) {
            cargarNombreCurso();
        } else {
            setNombreCurso('Selecciona un curso');
            setLoading(false);
        }
    }, [idCurso]);

    return (
        <Box>
            <Box sx={{ textAlign: 'center', marginTop: 5 }}>
                <Typography variant="h3">
                    {loading ? 'Cargando...' : nombreCurso}
                </Typography>
            </Box>
            <Outlet />
        </Box>
    );
}

export default Anotaciones;