import { useState, useEffect, useContext } from 'react';
import { CursoContext } from '../../context/CursoContext';
import { AsignaturaContext } from '../../context/AsignaturaContext';
import { getAnotacionesPorCursoYAsignatura, createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';
import useAlert from '../useAlerts';
import useCargarUsuario from '../useUsuario';

const useAnotaciones = () => {
  const { curso } = useContext(CursoContext);
  const { asignatura } = useContext(AsignaturaContext);
  const { usuario, loading: usuarioLoading } = useCargarUsuario();
  const [anotaciones, setAnotaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, showAlert] = useAlert();

  const fetchAnotaciones = async () => {
    if (!curso.idCurso || !asignatura.idAsignatura) {
      setAnotaciones([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getAnotacionesPorCursoYAsignatura(curso.idCurso, asignatura.idAsignatura);
      setAnotaciones(data);
    } catch (error) {
      console.error('Error al cargar las anotaciones', error);
      showAlert('Error al cargar las anotaciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnotaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curso.idCurso, asignatura.idAsignatura, usuario]);

  const addAnotacion = async (newAnotacion) => {
    try {
      await createAnotacion(newAnotacion);
      showAlert('Anotación creada correctamente', 'success');
      fetchAnotaciones();
    } catch (error) {
      console.error('Error al crear la anotación:', error);
      showAlert('Error al crear la anotación', 'error');
    }
  };

  const editAnotacion = async (id, updatedAnotacion) => {
    try {
      await updateAnotacion(id, updatedAnotacion);
      showAlert('Anotación actualizada correctamente', 'success');
      fetchAnotaciones();
    } catch (error) {
      console.error('Error al actualizar la anotación:', error);
      showAlert('Error al actualizar la anotación', 'error');
    }
  };

  const removeAnotacion = async (id) => {
    try {
      await deleteAnotacion(id);
      showAlert('Anotación eliminada correctamente', 'success');
      fetchAnotaciones();
    } catch (error) {
      console.error('Error al eliminar la anotación:', error);
      showAlert('Error al eliminar la anotación', 'error');
    }
  };

  return {
    anotaciones,
    loading,
    addAnotacion,
    editAnotacion,
    removeAnotacion,
    fetchAnotaciones,
    alert,
    usuario,
    usuarioLoading,
  };
};

export default useAnotaciones;
