import { useState, useEffect, useContext } from 'react';
import { CursoContext } from '../../context/CursoContext';
import { getSoloAlumnosByCurso } from '@services/cursos.service';

const useAlumnos = () => {
  const { curso } = useContext(CursoContext);
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);

  useEffect(() => {
    const cargarAlumnos = async () => {
      if (!curso.idCurso) {
        console.error('ID del curso no válido:', curso.idCurso);
        return;
      }
      try {
        const alumnosData = await getSoloAlumnosByCurso(curso.idCurso);
        if (Array.isArray(alumnosData)) {
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData.slice(0, 5));
        } else {
          console.error('Formato inesperado de datos:', alumnosData);
        }
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    };

    cargarAlumnos();
  }, [curso.idCurso]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = alumnos.filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(query)
    );
    setFilteredAlumnos(filtered.slice(0, 5));
    setIsListVisible(filtered.length > 0);
  };

  const handleAlumnoSelectHook = (alumno) => {
    setSelectedAlumno(alumno);
    setSearchTerm(`${alumno.nombre} ${alumno.apellido}`);
    setIsListVisible(false);
  };

  const resetAlumnos = () => {
    setSelectedAlumno(null);
    setSearchTerm('');
    setFilteredAlumnos(alumnos.slice(0, 5));
    setIsListVisible(false);
  };

  return {
    alumnos,
    filteredAlumnos,
    selectedAlumno,
    searchTerm,
    isListVisible,
    handleSearchChange,
    handleAlumnoSelectHook,
    resetAlumnos,
  };
};

export default useAlumnos;
