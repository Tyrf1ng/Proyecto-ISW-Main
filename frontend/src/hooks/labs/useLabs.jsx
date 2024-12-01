import { useState, useEffect } from 'react';
import { AllLabs, createLab, updateLab, deleteLab } from '@services/lab.service.js';

const useLabs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const addLab = async (lab) => {
    setLoading(true);
    try {
      const response = await createLab(lab);
      if (response.error) {
        setError(response.error);
      } else {
        setLabs([...labs, response]);
      }
    } catch (error) {
      setError(error);
      console.error("Error al crear el laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  const editLab = async (lab) => {
    setLoading(true);
    try {
      const response = await updateLab(lab);
      if (response.error) {
        setError(response.error);
      } else {
        setLabs(labs.map((l) => (l.id_lab === lab.id_lab ? response : l)));
      }
    } catch (error) {
      setError(error);
      console.error("Error al actualizar el laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  const removeLab = async (id_lab) => {
    setLoading(true);
    try {
      const response = await deleteLab(id_lab);
      if (response.error) {
        setError(response.error);
      } else {
        setLabs(labs.filter((lab) => lab.id_lab !== id_lab));
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al eliminar el laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return { labs, fetchLabs, addLab, editLab, removeLab, loading, error };
};

export default useLabs;