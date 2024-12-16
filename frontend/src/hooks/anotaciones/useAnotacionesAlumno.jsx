import { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../../context/UsuarioContext';
import { AsignaturaContext } from '../../context/AsignaturaContext';
import { getAnotacionesPorRutYAsignatura } from '../../services/anotaciones.service.js';

const useAnotacionesAlumno = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { asignatura } = useContext(AsignaturaContext);

  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnotaciones = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!usuario) {
          await cargarUsuario();
        }
        if (usuario?.rut && asignatura?.idAsignatura) {
          const response = await getAnotacionesPorRutYAsignatura(usuario.rut, asignatura.idAsignatura);
          setAnotaciones(response.data);
          setError(null);
        } else if (asignatura) {
          setAnotaciones([]);
          setError('No se ha seleccionado una asignatura.');
        } else {
          setAnotaciones([]);
          setError('No se ha seleccionado una asignatura.');
        }
      } catch (err) {
        setError(err.message || 'No se pudieron cargar las anotaciones.');
        setAnotaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnotaciones();
  }, [usuario, asignatura, cargarUsuario]);

  return { anotaciones, loading, error };
};

export default useAnotacionesAlumno;
