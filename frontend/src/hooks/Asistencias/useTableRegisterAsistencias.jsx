import { useState, useEffect } from 'react';

const useTablaRegisterAsistencia = (students, handleRegister) => {
  const [attendance, setAttendance] = useState([]);
  const [allPresent, setAllPresent] = useState(false);
  const [allAbsent, setAllAbsent] = useState(false);

  useEffect(() => {
    setAttendance(
      students.map((student) => ({
        rut: student.rut,
        nombre: `${student.nombre} ${student.apellido}`,
        presente: false,
        ausente: false,
        justificado: false,
        observacion: ''
      }))
    );
  }, [students]);

  useEffect(() => {
    if (allPresent) {
      setAttendance((prevAttendance) =>
        prevAttendance.map((record) => ({
          ...record,
          presente: true,
          ausente: false,
          justificado: false,
          observacion: ''
        }))
      );
      setAllAbsent(false);
    }
  }, [allPresent]);

  useEffect(() => {
    if (allAbsent) {
      setAttendance((prevAttendance) =>
        prevAttendance.map((record) => ({
          ...record,
          presente: false,
          ausente: true,
          justificado: false,
          observacion: ''
        }))
      );
      setAllPresent(false);
    }
  }, [allAbsent]);

  const handleCheckboxChange = (rut, type) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((record) => {
        if (record.rut === rut) {
          return {
            ...record,
            presente: type === 'presente' ? !record.presente : false,
            ausente: type === 'ausente' ? !record.ausente : false,
            justificado: type === 'justificado' ? !record.justificado : false,
            observacion: type === 'justificado' && !record.justificado ? record.observacion : ''
          };
        }
        return record;
      })
    );
  };

  const handleObservationChange = (rut, value) => {
    if (value.length > 60) {
      return; 
    }
    setAttendance((prevAttendance) =>
      prevAttendance.map((record) => {
        if (record.rut === rut) {
          return { ...record, observacion: value };
        }
        return record;
      })
    );
  };

  const handleSave = () => {
    handleRegister(attendance);
  };

  return {
    attendance,
    allPresent,
    setAllPresent,
    allAbsent,
    setAllAbsent,
    handleCheckboxChange,
    handleObservationChange,
    handleSave
  };
};

export default useTablaRegisterAsistencia;
