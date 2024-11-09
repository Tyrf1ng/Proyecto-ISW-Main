import { useEffect, useState } from 'react';
import { AllNotas } from '@services/notas.service.js';

const useNotas = () => {
  const [notas, setNotas] = useState([]);

  const fetchNotas = async () => {
    try {
      const response = await AllNotas();
      setNotas(response.data); // Asegúrate de acceder correctamente a las notas en `response`
    } catch (error) {
      console.error("Error al obtener las notas: ", error);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []); // Se llama una vez al montar el componente

  return { notas, fetchNotas };
};

export default useNotas;
