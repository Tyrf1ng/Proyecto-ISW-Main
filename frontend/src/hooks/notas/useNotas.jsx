import { useEffect, useState } from 'react';
import {  NotasCurso } from '@services/notas.service.js';


const useNotasCurso = (id_curso) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  const fetchNotas = async () => {
    try {
      setLoading(true);
      const response = await NotasCurso(id_curso); // Llama al servicio para obtener las notas
      setNotas(response.data); // Almacena las notas en el estado
    } catch (err) {
      setError('Error al obtener las notas'); // Establece el error si la llamada falla
      console.error(err);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  useEffect(() => {
    if (id_curso) {
      fetchNotas(); // Solo hace la llamada si id_asignatura está disponible
    }
  }, [id_curso]); // Vuelve a ejecutar si cambia id_asignatura

  return { notas, loading, error, fetchNotas };
};

export default useNotasCurso;