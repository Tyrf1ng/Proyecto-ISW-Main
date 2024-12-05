import { useState, useEffect } from 'react';
import { AllLabs } from '@services/lab.service.js';

const useLabsDocente = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const response = await AllLabs();
      setLabs(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener los laboratorios: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return { labs, loading, error };
};

export default useLabsDocente;