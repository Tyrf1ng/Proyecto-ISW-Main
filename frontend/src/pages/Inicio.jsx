import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { CursoContext } from '../context/CursoContext'; // Importa el contexto
import { getCursos } from '../services/cursos.service'; // Asegúrate de tener esta función para obtener el nombre del curso

function Inicio() {
  const { idCurso } = useContext(CursoContext); // Usa el contexto para obtener el idCurso
  const [nombreCurso, setNombreCurso] = useState('');

  useEffect(() => {
    const cargarNombreCurso = async () => {
      try {
        const cursos = await getCursos();
        const cursoSeleccionado = cursos.find((curso) => curso.id_curso === idCurso);
        if (cursoSeleccionado) {
          setNombreCurso(cursoSeleccionado.nombre);
        }
      } catch (error) {
        console.error("Error al obtener el nombre del curso:", error);
      }
    };

    if (idCurso) {
      cargarNombreCurso();
    }
  }, [idCurso]);

  return (
    <div>
      <Typography variant="h4">Página de Inicio</Typography>
      <Typography variant="h6">
        {nombreCurso ? `Curso: ${nombreCurso}` : 'Selecciona un curso'}
      </Typography>
    </div>
  );
}

export default Inicio;
