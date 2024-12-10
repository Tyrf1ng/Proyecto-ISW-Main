import { useEffect, useState } from "react";
import { getRutsDocentes } from "@services/usuarios.service";
import { getAsignaturasByProfesor } from "@services/asignatura.service";
import { getCursosByProfesor } from "@services/cursos.service";
import { AllLabs } from "@services/lab.service";
import { AllHorarios } from "@services/horario.service";

export const useAddReservas = () => {
  const [rutsDocentes, setRutsDocentes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarRutsDocentes = async () => {
      try {
        const docentes = await getRutsDocentes();
        setRutsDocentes(docentes);
      } catch (error) {
        console.error("Error al cargar RUTs de docentes:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarRutsDocentes();
  }, []);

  const cargarAsignaturas = async (rut) => {
    setCargando(true);
    try {
      const asignaturas = await getAsignaturasByProfesor(rut);
      setAsignaturas(asignaturas);
    } catch (error) {
      console.error("Error al cargar asignaturas:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarCursos = async (rut) => {
    setCargando(true);
    try {
      const cursos = await getCursosByProfesor(rut);
      setCursos(cursos);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    } finally {
      setCargando(false);
    }
  };

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

  return { rutsDocentes, asignaturas, cursos, laboratorios, horarios, cargando, cargarAsignaturas, cargarCursos };
};