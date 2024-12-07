import { useState, useEffect } from 'react';
import { 
    getAllReservas, 
    createReserva, 
    updateReserva, 
    deleteReserva, 
    getReservasByUsuario, 
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


  const fetchReservasByUsuario = async (rut) => {
    setLoading(true);
    try {
      const data = await getReservasByUsuario(rut);
      if (data.error) {
        setError(data.error);
      } else {
        setReservas(data);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener las reservas por usuario: ", error);
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
    fetchReservasByUsuario, 
    loading, 
    error 
  };
};

export default useReservas;