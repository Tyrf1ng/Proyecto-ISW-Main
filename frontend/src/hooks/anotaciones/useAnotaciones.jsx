import { useState, useEffect } from 'react';
import { getAnotaciones } from '@services/anotaciones.service.js';

const useAnotaciones = () => {
  const [anotaciones, setAnotaciones] = useState([]);

  const fetchAnotaciones = async () => {
    try {
      const response = await getAnotaciones();
      setAnotaciones(response);
    } catch (error) {
      console.error("Error al obtener anotaciones: ", error);
    }
  };

  useEffect(() => {
    fetchAnotaciones();
  }, []);

  return { anotaciones, fetchAnotaciones };
};

export default useAnotaciones;
