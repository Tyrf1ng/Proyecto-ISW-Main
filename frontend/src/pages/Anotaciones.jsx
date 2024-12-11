import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { getCursos } from '../services/cursos.service';
import { Outlet } from 'react-router-dom';

function Anotaciones() {
  const { curso } = useContext(CursoContext); // Cambiar para obtener todo el objeto curso
  const [nombreCurso, setNombreCurso] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarNombreCurso = async () => {
      if (!curso || !curso.idCurso) {  // Verificar si el curso y su id están definidos
        setNombreCurso('Curso no seleccionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cursos = await getCursos();
        const cursoSeleccionado = cursos.find((cursoItem) => cursoItem.id_curso === curso.idCurso); // Comparar con idCurso del objeto 'curso'
        
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

    cargarNombreCurso();  // Llamar a la función de carga siempre que 'curso' cambie
  }, [curso]);  // El efecto se ejecuta cada vez que cambie el curso

  return (
    <div className="py-6 px-4 bg-gray-100 dark:bg-[#1F2937] min-h-screen">
      <div className="text-center mt-12">
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
          {loading ? 'Cargando...' : `Anotaciones del curso ${nombreCurso}`}
        </h3>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Anotaciones;
