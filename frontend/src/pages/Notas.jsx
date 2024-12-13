import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { AsignaturaContext } from '../context/AsignaturaContext';
import { getCursos } from '../services/cursos.service';
import { Outlet } from 'react-router-dom';
import { UsuarioContext } from '../context/UsuarioContext';

function Notas() {
    const { curso } = useContext(CursoContext);
    const { asignatura } = useContext(AsignaturaContext);
    const { usuario } = useContext(UsuarioContext);

    const [nombreCurso, setNombreCurso] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);

            if (usuario.rol === 'Docente') {
                if (!curso || !curso.idCurso) { // Verificar si el curso y su id están definidos
                    setNombreCurso('Curso no seleccionado');
                } else {
                    try {
                        const cursos = await getCursos();
                        const cursoSeleccionado = cursos.find((cursoItem) => cursoItem.id_curso === curso.idCurso);

                        if (cursoSeleccionado) {
                            setNombreCurso(cursoSeleccionado.nombre);
                        } else {
                            setNombreCurso('Curso no encontrado');
                        }
                    } catch (error) {
                        console.error("Error al obtener el nombre del curso:", error);
                        setNombreCurso('Error al cargar curso');
                    }
                }
            } else if (usuario.rol === 'Alumno') {
                if (asignatura && asignatura.nombre) {
                    setNombreCurso(asignatura.nombre); // Mostrar el nombre de la asignatura
                } else {
                    setNombreCurso('Asignatura no seleccionada');
                }
            } else {
                setNombreCurso('Rol no reconocido');
            }

            setLoading(false);
        };

        cargarDatos();
    }, [curso, asignatura, usuario]);

    return (
      <div className="py-6 px-4 bg-gray-100 dark:bg-[#1F2937] min-h-screen">
          <div className="text-center mt-12">
              <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                  {loading 
                      ? 'Cargando...' 
                      : usuario.rol === 'Docente' 
                          ? `Curso: ${nombreCurso}` 
                          : usuario.rol === 'Alumno' 
                              ? `Asignatura: ${asignatura.nombre}` 
                              : 'Información no disponible'}
              </h3>
          </div>
          <div className="mt-6">
              <Outlet />
          </div>
      </div>
  );
}
export default Notas;