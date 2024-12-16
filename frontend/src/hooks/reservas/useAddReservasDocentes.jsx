import { useEffect, useState, useContext } from "react";
import { AllLabs } from "@services/lab.service";
import { AllHorarios } from "@services/horario.service";
import { UsuarioContext } from '../../context/UsuarioContext';
import { CursoContext } from '../../context/CursoContext';
import { AsignaturaContext } from '../../context/AsignaturaContext';

export const useAddReservasDocentes = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { curso } = useContext(CursoContext);
  const { asignatura } = useContext(AsignaturaContext);
  const [laboratorios, setLaboratorios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedHorario, setSelectedHorario] = useState('');
  const [fecha, setFecha] = useState('');
  const [validationError, setValidationError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    }
  }, [usuario, cargarUsuario]);

  useEffect(() => {
    console.log("Curso en useAddReservasDocentes:", curso);
    console.log("Asignatura en useAddReservasDocentes:", asignatura);
  }, [curso, asignatura]);

  const cargarLaboratorios = async () => {
    setCargando(true);
    try {
      const labs = await AllLabs();
      setLaboratorios(labs.data);
    } catch (error) {
      console.error("Error al cargar laboratorios:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarHorarios = async () => {
    setCargando(true);
    try {
      const horarios = await AllHorarios();
      setHorarios(horarios.data);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLaboratorios();
    cargarHorarios();
  }, []);

  const handleSeleccionarLab = (e) => {
    setSelectedLab(e.target.value);
  };

  const handleSeleccionarHorario = (e) => {
    setSelectedHorario(e.target.value);
  };

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  return {
    laboratorios,
    horarios,
    cargando,
    selectedLab,
    selectedHorario,
    fecha,
    validationError,
    handleSeleccionarLab,
    handleSeleccionarHorario,
    handleFechaChange,
    asignatura,
    curso, // No convertir a array vacío
    usuario,
    setSelectedLab,
    setSelectedHorario,
    setFecha,
  };
};