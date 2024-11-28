import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { getCursos } from '../services/cursos.service';
import { Outlet } from 'react-router-dom';

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
        <div className="py-6 px-4 bg-gray-100 dark:bg-[#1F2937] min-h-screen">
            <div className="text-center mt-12">
                <h3 className=" text-3xl font-semibold text-gray-800 dark:text-white">
                    {loading ? 'Cargando...' : nombreCurso}
                </h3>
            </div>
            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
}

export default Anotaciones;
