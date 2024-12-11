import { useState, useEffect, useContext, useCallback } from 'react';
import { getNotasPorAsignatura } from '@services/notas.service';
import { AsignaturaContext } from '@context/AsignaturaContext';
import { UsuarioContext } from '../../context/UsuarioContext';

const useNotasAsignatura = () => {
  const { idAsignatura } = useContext(AsignaturaContext);
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Llama a cargarUsuario solo si el usuario aún no está cargado
  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    }
  }, [usuario, cargarUsuario]);  // Dependencia de usuario y cargarUsuario

  // Verificar si el usuario está disponible antes de proceder con las notas
  useEffect(() => {
    if (usuario && idAsignatura) {
      fetchNotas();
    }
  }, [usuario, idAsignatura]);  // Dependencias de usuario e idAsignatura

  const fetchNotas = useCallback(async () => {
    try {
      setLoading(true);
      if (!usuario || !usuario.rut) {
        throw new Error('Usuario o su RUT no están disponibles');
      }
      const response = await getNotasPorAsignatura(usuario.rut, idAsignatura);
      setNotas(Array.isArray(response) ? response : []);
      setError(null);
    } catch (error) {
      setError(error.message || 'Error al obtener las notas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [usuario, idAsignatura]);

  // Si el usuario no está disponible, mostrar una pantalla de carga
  if (!usuario) {
    return { notas, loading, error };
  }

  return { notas, loading, error, fetchNotas };
};

export default useNotasAsignatura;