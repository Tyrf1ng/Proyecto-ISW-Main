// frontend/src/hooks/useStudentAttendance.js
import { useState, useEffect } from 'react';
import { getAsistenciasAlumnoAsignatura } from '../services/Asistencias.service'; 

const useStudentAttendance = (rut, idAsignatura) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await getAsistenciasAlumnoAsignatura(rut, idAsignatura);
        setAttendance(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [rut, idAsignatura]);

  return { attendance, loading, error };
};

export default useStudentAttendance;