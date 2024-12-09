import { useEffect, useState, useContext } from 'react';
import { NotasCurso } from '@services/notas.service.js';
import { CursoContext } from '@context/CursoContext';

const useNotasCurso = () => {
  const { curso } = useContext(CursoContext);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotas = async () => {
    try {
      if (!curso.idCurso) {
        return;
      }
      const response = await NotasCurso(curso.idCurso);
      if (response.status === 'Success' && Array.isArray(response.data)) {
        setNotas(response.data);
      } else {
        setNotas([]); 
      }
    } catch (error) {
      console.error("Error en obtener las notas: ", error);
      setNotas([]); 
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (curso.idCurso) {
      fetchNotas();
    }
  }, [curso.idCurso]);
  return { notas, loading, fetchNotas };
};

export default useNotasCurso;