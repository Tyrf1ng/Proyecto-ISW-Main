import { useState, useEffect } from 'react';
import { 
    getAllReservas, 
    createReserva, 
    updateReserva, 
    deleteReserva, 
    getReservasByUsuario, 
} from '@services/reservas.service.js';
import { getCurso, getCursosByProfesor } from '@services/cursos.service.js'; 
import { getNombreAsignaturaById, getAsignaturasByProfesor } from '@services/asignatura.service.js'; 
import { getRutsDocentes } from '@services/usuarios.service.js';

const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [reservasConNombre, setReservasConNombre] = useState([]);
  const [rutsDocentes, setRutsDocentes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservas();
    fetchRutsDocentes();
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

  const fetchRutsDocentes = async () => {
    try {
      const docentes = await getRutsDocentes();
      setRutsDocentes(docentes);
    } catch (error) {
      console.error('Error al obtener RUTs de docentes:', error);
    }
  };

  const fetchAsignaturasByProfesor = async (rut) => {
    try {
      const asignaturas = await getAsignaturasByProfesor(rut);
      setAsignaturas(asignaturas);
    } catch (error) {
      console.error('Error al obtener asignaturas:', error);
    }
  };

  const fetchCursosByProfesor = async (rut) => {
    try {
      const cursos = await getCursosByProfesor(rut);
      setCursos(cursos);
    } catch (error) {
      console.error('Error al obtener cursos:', error);
    }
  };

  const fetchNombreAsignatura = async (id_asignatura) => {
    try {
      const nombreAsignatura = await getNombreAsignaturaById(id_asignatura);
      return nombreAsignatura;
    } catch (error) {
      console.error("Error al obtener el nombre de la asignatura: ", error);
      return id_asignatura; 
    }
  };

  const fetchNombreCurso = async (id_curso) => {
    try {
      const nombreCurso = await getCurso(id_curso);
      return nombreCurso;
    } catch (error) {
      console.error("Error al obtener el nombre del curso: ", error);
      return id_curso; 
    }
  };

  const mapReservasConNombre = async (laboratorios) => {
    if (!laboratorios) {
      console.error("Laboratorios no está definido");
      return;
    }

    const reservasMapeadas = await Promise.all(reservas.map(async reserva => {
      const nombreCurso = reserva.id_curso ? await fetchNombreCurso(reserva.id_curso) : reserva.id_curso;
      const nombreAsignatura = reserva.id_asignatura ? await fetchNombreAsignatura(reserva.id_asignatura) : reserva.id_asignatura;
      const nombreLab = laboratorios.find(lab => lab.id_lab === reserva.id_lab)?.nombre || reserva.id_lab;
      const reservaConNombre = { 
        ...reserva, 
        nombreCurso: nombreCurso ? nombreCurso.nombre : reserva.id_curso, // Asegúrate de que nombreCurso.nombre esté asignado correctamente
        nombre_asignatura: nombreAsignatura,
        nombre_lab: nombreLab
      };
      return reservaConNombre;
    }));
    setReservasConNombre(reservasMapeadas);
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
    reservasConNombre,
    rutsDocentes,
    asignaturas,
    cursos,
    fetchReservas, 
    editReserva, 
    removeReserva, 
    fetchReservasByUsuario, 
    fetchAsignaturasByProfesor,
    fetchCursosByProfesor,
    mapReservasConNombre,
    loading, 
    error 
  };
};

export default useReservas;