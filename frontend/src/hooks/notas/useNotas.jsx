import { useEffect, useState, useCallback } from 'react';
import { NotasCurso } from '@services/notas.service.js';

const useNotasCurso = (id_curso) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await NotasCurso(id_curso);
      setNotas(Array.isArray(response.data) ? response.data : []);
      setError(null); // Limpia cualquier error anterior
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener las notas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id_curso]);

  useEffect(() => {
    if (id_curso) {
      fetchNotas();
    }
  }, [id_curso, fetchNotas]);

  return { notas, loading, error, fetchNotas };
};

export default useNotasCurso;