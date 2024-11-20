import { useState, useEffect } from 'react';
import { 
    getAllReservas, 
    createReserva, 
    updateReserva, 
    deleteReserva, 
    getReservasByLab, 
    getReservasByDocente, 
    getReservasByFecha 
} from '@services/reservas.service.js';

const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const data = await getAllReservas();
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener las reservas: ", error);
    } finally {
      setLoading(false);
    }
  };

  const addReserva = async (reserva) => {
    setLoading(true);
    try {
      const data = await createReserva(reserva);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas([...reservas, data]);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al crear la reserva: ", error);
    } finally {
      setLoading(false);
    }
  };

  const editReserva = async (id_reserva, reserva) => {
    setLoading(true);
    try {
      const data = await updateReserva(id_reserva, reserva);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(reservas.map((r) => (r.id_reserva === id_reserva ? data : r)));
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al actualizar la reserva: ", error);
    } finally {
      setLoading(false);
    }
  };

  const removeReserva = async (id_reserva) => {
    setLoading(true);
    try {
      const data = await deleteReserva(id_reserva);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(reservas.filter((reserva) => reserva.id_reserva !== id_reserva));
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al eliminar la reserva: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservasByLab = async (id_lab) => {
    setLoading(true);
    try {
      const data = await getReservasByLab(id_lab);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener las reservas por laboratorio: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservasByDocente = async (rut_docente) => {
    setLoading(true);
    try {
      const data = await getReservasByDocente(rut_docente);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener las reservas por docente: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservasByFecha = async (fecha) => {
    setLoading(true);
    try {
      const data = await getReservasByFecha(fecha);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(data.data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener las reservas por fecha: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    reservas, 
    fetchReservas, 
    addReserva, 
    editReserva, 
    removeReserva, 
    fetchReservasByLab, 
    fetchReservasByDocente, 
    fetchReservasByFecha, 
    loading, 
    error 
  };
};

export default useReservas;