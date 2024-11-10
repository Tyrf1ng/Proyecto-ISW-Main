import { useState, useEffect } from 'react';
import { AllLabs, createLab, updateLab, deleteLab } from '@services/lab.service.js';

const useLabs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtiene los laboratorios y actualiza el estado.
  const fetchLabs = async () => {
    setLoading(true);
    try {
      const response = await AllLabs();
      setLabs(response.data);
    } catch (error) {
      setError(error);
      console.error("Error al obtener los laboratorios: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Crea un nuevo laboratorio y lo añade a la lista.
  const addLab = async (lab) => {
    setLoading(true);
    try {
      const response = await createLab(lab);
      setLabs([...labs, response]); // Añade el nuevo laboratorio a la lista
    } catch (error) {
      setError(error);
      console.error("Error al crear el laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Actualiza un laboratorio existente en la lista.
  const editLab = async (lab) => {
    setLoading(true);
    try {
      const response = await updateLab(lab);
      setLabs(labs.map((l) => (l.id_lab === lab.id_lab ? response : l)));
    } catch (error) {
      setError(error);
      console.error("Error al actualizar el laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Elimina un laboratorio de la lista.
  const removeLab = async (id_lab) => {
    setLoading(true);
    try {
      await deleteLab(id_lab);
      setLabs(labs.filter((lab) => lab.id_lab !== id_lab));
    } catch (error) {
      setError(error);
      console.error("Error al eliminar el laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []); // Se llama una vez al montar el componente

  return { labs, fetchLabs, addLab, editLab, removeLab, loading, error };
};

export default useLabs;