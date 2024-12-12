import { useState, useContext, useEffect } from 'react';
import { CursoContext } from '../context/CursoContext';
import { UsuarioContext } from '../context/UsuarioContext';
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import { createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';
import { getSoloAlumnosByCurso } from '@services/cursos.service';
import TableAnotacionComponent from '../components/Table';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatDateToDMY } from '../helpers/formatData'; // Importa la nueva función

const Ver_anotaciones = () => {
  const { curso } = useContext(CursoContext);
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { anotaciones, fetchAnotaciones } = useAnotaciones();
  
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAnotacion, setCurrentAnotacion] = useState(null);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut: '',
    descripcion: '',
    id_asignatura: curso.idCurso || '',
    createdAt: new Date().toISOString(),
  });
  
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [anotacionToDelete, setAnotacionToDelete] = useState(null);

  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    }
  }, [usuario, cargarUsuario]);

  useEffect(() => {
    if (curso.idCurso) {
      const cargarAlumnos = async () => {
        try {
          const alumnosData = await getSoloAlumnosByCurso(curso.idCurso);
          setAlumnos(alumnosData);
          setFilteredAlumnos(alumnosData.slice(0, 5));
        } catch (error) {
          console.error("Error al cargar los alumnos", error);
        }
      };
      cargarAlumnos();
    }
  }, [curso.idCurso]);

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleDateFilterChange = (e) => {
    const date = e.target.value;
    setFilterDate(date ? formatDateToDMY(new Date(date)) : ''); // Formateamos la fecha
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnotacion({ ...newAnotacion, [name]: value });
  };

  const handleSelectChange = (e) => {
    setNewAnotacion({ ...newAnotacion, tipo: e.target.value });
  };

  const handleAlumnoSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = alumnos.filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(query)
    );
    setFilteredAlumnos(filtered.slice(0, 5));
    setIsListVisible(filtered.length > 0);
  };

  const handleAlumnoSelect = (alumno) => {
    setSelectedAlumno(alumno);
    setNewAnotacion({ ...newAnotacion, rut: alumno.rut });
    setSearchTerm(`${alumno.nombre} ${alumno.apellido}`);
    setIsListVisible(false);
  };

  const handleOpenModal = (anotacion = null) => {
    setIsEditMode(!!anotacion);
    setCurrentAnotacion(anotacion);

    if (anotacion) {
      const alumno = alumnos.find((a) => a.rut === anotacion.rut);
      setSearchTerm(alumno ? `${alumno.nombre} ${alumno.apellido}` : '');
    }

    setNewAnotacion(
      anotacion || {
        tipo: 'Positiva',
        rut: '',
        descripcion: '',
        id_asignatura: curso.idCurso || '',
        createdAt: new Date().toISOString(),
      }
    );

    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateAnotacion(currentAnotacion.id_anotacion, newAnotacion);
      } else {
        await createAnotacion(newAnotacion);
      }
      fetchAnotaciones();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la anotación:', error);
    }
  };

  const handleDeleteRequest = (id) => {
    setAnotacionToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAnotacion(anotacionToDelete);
      fetchAnotaciones();
    } catch (error) {
      console.error('Error al eliminar la anotación:', error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const filterAnotaciones = (anotaciones) => {
    return anotaciones.filter((anotacion) => {
      const anotacionDateFormatted = formatDateToDMY(anotacion.createdAt);
      const descriptionMatch = anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase());
      const dateMatch = filterDate ? anotacionDateFormatted === filterDate : true;
      return descriptionMatch && dateMatch;
    });
  };

  const countAnotacionesTipo = (anotaciones) => {
    let positivas = 0;
    let negativas = 0;

    anotaciones.forEach((anotacion) => {
      if (anotacion.tipo === 'Positiva') {
        positivas++;
      } else if (anotacion.tipo === 'Negativa') {
        negativas++;
      }
    });

    return { positivas, negativas };
  };

  const filteredAnotaciones = filterAnotaciones(anotaciones);
  const { positivas, negativas } = countAnotacionesTipo(filteredAnotaciones);

  const data = [
    { name: 'Positivas', value: positivas },
    { name: 'Negativas', value: negativas },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      {/* Contenido omitido por brevedad */}
    </div>
  );
};

export default Ver_anotaciones;
