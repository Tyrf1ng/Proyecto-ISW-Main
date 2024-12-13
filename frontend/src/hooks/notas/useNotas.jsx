import { useEffect, useState, useContext } from 'react';
import { getNotasPorCursoYAsignatura } from '@services/notas.service.js';
import { CursoContext } from '@context/CursoContext';
import { AsignaturaContext } from '@context/AsignaturaContext';

const useNotasCurso = () => {
  const { curso } = useContext(CursoContext);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { asignatura } = useContext(AsignaturaContext);
  
  const fetchNotas = async () => {
    try {
      if (!curso.idCurso && !asignatura.idAsignatura) {
        return;
      }
      const response = await getNotasPorCursoYAsignatura(curso.idCurso, asignatura.idAsignatura);
      if (Array.isArray(response)) {
        setNotas(response); 
      } else {
        setNotas([]);
        console.error("Formato de respuesta inesperado:", response);
      }
    } catch (error) {
      console.error("Error al obtener las notas:", error);
      setNotas([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (curso.idCurso && asignatura.idAsignatura) {
      fetchNotas();
    }
  }, [curso.idCurso, asignatura.idAsignatura]);
  return { notas, loading, fetchNotas };
};

export default useNotasCurso;