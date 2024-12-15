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
    const cargarNombreCurso = async () => {
      if (!curso || !curso.idCurso) {
        setNombreCurso('Curso no seleccionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    cargarNombreCurso();
  }, [curso]);

  const getTitulo = () => {
    if (loading) {
      return 'Cargando...';
    }

    if (!usuario || usuario.rol === undefined || usuario.rol === null) {
      return 'Notas';
    }

    if (usuario.rol === "Docente") {
      return `Notas para el curso ${nombreCurso}`;
    } else if (usuario.rol === "Alumno") {
      return `Notas en ${asignatura.nombre}`;
    } else {
      return 'Notas';
    }
  };

  return (
    <div className="px-4 bg-gray-100 dark:bg-[#1F2937] min-h-screen">
      <div className="text-center mt-12">
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
          {getTitulo()}
        </h3>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Notas;
