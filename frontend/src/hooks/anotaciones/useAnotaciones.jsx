import { useState, useEffect, useContext } from 'react';
import { getAnotacionesCurso } from '@services/anotaciones.service.js'; // Asegúrate de importar correctamente
import { CursoContext } from '../../context/CursoContext'; // Importa el contexto

const useAnotaciones = () => {
  const { idCurso } = useContext(CursoContext); // Obtén el idCurso del contexto
  const [anotaciones, setAnotaciones] = useState([]);

  const fetchAnotaciones = async () => {
    try {
      if (!idCurso) return; // No intentes cargar anotaciones si no hay un curso seleccionado
      const response = await getAnotacionesCurso(idCurso); // Usa la API para obtener anotaciones del curso
      setAnotaciones(response);
    } catch (error) {
      console.error("Error al obtener anotaciones: ", error);
    }
  };

  useEffect(() => {
    fetchAnotaciones();
  }, [idCurso]); // Ejecuta el efecto cuando cambie el idCurso

  return { anotaciones, fetchAnotaciones };
};

export default useAnotaciones;
