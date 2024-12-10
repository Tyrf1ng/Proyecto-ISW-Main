import { useState, useEffect, useCallback } from 'react';
import { getNotasPorAsignatura } from '@services/notas.service';

const useNotasAsignatura = (rut, id_asignatura) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getNotasPorAsignatura(rut, id_asignatura);
      setNotas(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener las notas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [rut, id_asignatura]);
  return { notas, loading, error, fetchNotas };
};

export default useNotasAsignatura;
