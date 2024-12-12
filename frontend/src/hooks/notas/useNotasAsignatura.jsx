import { useState, useEffect, useContext } from 'react';
import { getNotasPorAsignatura } from '@services/notas.service';
import { AsignaturaContext } from '@context/AsignaturaContext';
import { UsuarioContext } from '@context/UsuarioContext';

const useNotasAsignatura = () => {
  const { asignatura } = useContext(AsignaturaContext);
  const { usuario } = useContext(UsuarioContext);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotas = async () => {
    try {
      if (!asignatura?.idAsignatura || !usuario?.rut) {
        setError('Faltan datos para cargar las notas');
        setNotas([]);
        return;
      }
      const response = await getNotasPorAsignatura(usuario.rut, asignatura.idAsignatura);
      if (response.status === 'Success' && Array.isArray(response.data)) {
        setNotas(response.data);
      } else {
        setNotas([]);
      }
    } catch (error) {
      console.error("Error en obtener las notas: ", error);
      setError('Error al cargar las notas');
      setNotas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (asignatura?.idAsignatura && usuario?.rut) {
      fetchNotas();
    }
  }, [asignatura?.idAsignatura, usuario?.rut]);

  return { notas, loading, error, fetchNotas };
};

export default useNotasAsignatura;