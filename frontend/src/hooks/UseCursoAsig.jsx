import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext';
import { AsignaturaContext } from '../context/AsignaturaContext';
import { getCursos } from '../services/cursos.service';

const useCursoAsig = () => {
  const [nombreCurso, setNombreCurso] = useState('');
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [loading, setLoading] = useState(true);
  const { curso } = useContext(CursoContext);
  const { asignatura } = useContext(AsignaturaContext);

  useEffect(() => {
    const cargarNombreCurso = async () => {
      if (!curso || !curso.idCurso) {
        setNombreCurso('Curso no seleccionado');
        return;
      }

      try {
        const cursos = await getCursos();
        const cursoSeleccionado = cursos.find(
          (cursoItem) => cursoItem.id_curso === curso.idCurso
        );

        if (cursoSeleccionado) {
          setNombreCurso(cursoSeleccionado.nombre);
        } else {
          setNombreCurso('Curso no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del curso:', error);
        setNombreCurso('Error al cargar curso');
      }
    };

    const cargarNombreAsignatura = () => {
      if (!asignatura || !asignatura.nombre) {
        setNombreAsignatura('Asignatura no seleccionada');
        return;
      }

      setNombreAsignatura(asignatura.nombre);
    };

    const cargarDatos = async () => {
      setLoading(true);
      await cargarNombreCurso();
      cargarNombreAsignatura();
      setLoading(false);
    };

    cargarDatos();
  }, [curso, asignatura]);

  return { nombreCurso, nombreAsignatura, loading };
};

export default useCursoAsig;