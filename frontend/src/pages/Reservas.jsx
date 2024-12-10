import { useEffect, useState } from 'react';
import useReservas from '../hooks/reservas/useReservas';
import useLabs from '../hooks/labs/useLabs'; 
import { useHorarios } from '../hooks/horarios/useHorarios'; 
import TableReservas from '../components/TableReservas'; 
import { getCurso, getCursosByProfesor } from '@services/cursos.service.js'; 
import { getNombreAsignaturaById, getAsignaturasByProfesor } from '@services/asignatura.service.js'; 
import { getRutsDocentes } from '@services/usuarios.service.js';

const Reservas = () => {
  const { reservas, fetchReservas, addReserva, editReserva, removeReserva, error } = useReservas();
  const { labs: laboratorios, fetchLabs } = useLabs();
  const { horarios, fetchHorarios } = useHorarios(); 
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newReserva, setNewReserva] = useState({
    id_lab: '',
    rut: '',
    fecha: '',
    id_horario: '',
    id_asignatura: '',
    id_curso: ''
  });
  const [currentReserva, setCurrentReserva] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [reservasConNombre, setReservasConNombre] = useState([]);
  const [rutsDocentes, setRutsDocentes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    fetchReservas();
    fetchLabs(); 
    fetchHorarios(); 
    fetchRutsDocentes(); 
  }, []);

  useEffect(() => {
    if (reservas.length > 0) {
      mapReservasConNombre();
    }
  }, [reservas]);

  const fetchRutsDocentes = async () => {
    try {
      const docentes = await getRutsDocentes();
      setRutsDocentes(docentes);
    } catch (error) {
      console.error('Error al obtener RUTs de docentes:', error);
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

  const mapReservasConNombre = async () => {
    const reservasMapeadas = await Promise.all(reservas.map(async reserva => {
      const nombreCurso = reserva.id_curso ? await fetchNombreCurso(reserva.id_curso) : reserva.id_curso;
      const nombreAsignatura = reserva.id_asignatura ? await fetchNombreAsignatura(reserva.id_asignatura) : reserva.id_asignatura;
      const reservaConNombre = { 
        ...reserva, 
        nombre_curso: nombreCurso ? nombreCurso.nombre : reserva.id_curso,
        nombre_asignatura: nombreAsignatura
      };
      return reservaConNombre;
    }));
    setReservasConNombre(reservasMapeadas);
  };

  const handleFilterChange = (e) => setFilterText(e.target.value);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = async (reserva) => {
    setCurrentReserva({
      ...reserva,
      usuario: reserva.rut,
      id_horario: reserva.id_horario
    });
  
    try {
      const asignaturas = await getAsignaturasByProfesor(reserva.rut);
      setAsignaturas(asignaturas);
  
      const cursos = await getCursosByProfesor(reserva.rut);
      setCursos(cursos);
    } catch (error) {
      console.error('Error al obtener asignaturas y cursos:', error);
    }
  
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  const handleDeleteOpen = (reserva) => {
    setCurrentReserva({
        ...reserva,
        nombre_profesor: reserva.usuario,
        fecha: reserva.fecha,
        horario: reserva.horario
    });
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => setDeleteOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReserva({ ...newReserva, [name]: value });
  };

  const handleEditInputChange = async (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setCurrentReserva({ ...currentReserva, [name]: value });

    if (name === 'rut' && value) {
      try {
        const asignaturas = await getAsignaturasByProfesor(value);
        setAsignaturas(asignaturas);

        const cursos = await getCursosByProfesor(value);
        setCursos(cursos);


        setCurrentReserva((prevState) => ({
          ...prevState,
          usuario: value,
          id_asignatura: asignaturas.length > 0 ? asignaturas[0].id_asignatura : '',
          id_curso: cursos.length > 0 ? cursos[0].id_curso : ''
        }));
      } catch (error) {
        console.error('Error al obtener asignaturas y cursos:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await addReserva(newReserva);
      handleClose();
      fetchReservas();
      setCreateSuccess(true); 
    } catch (error) {
      console.error("Error al crear la reserva: ", error);
      setValidationError("Los valores ingresados no son válidos");
    }
  };

  const handleEditSubmit = async () => {
    if (!currentReserva.id_horario) {
      setValidationError("El campo 'Horario' es obligatorio.");
      return;
    }


    try {
      await editReserva(currentReserva.id_reserva, {
        id_lab: currentReserva.id_lab,
        rut: currentReserva.rut,
        fecha: currentReserva.fecha,
        id_horario: currentReserva.id_horario,
        id_asignatura: currentReserva.id_asignatura,
        id_curso: currentReserva.id_curso
      });
      handleEditClose();
      fetchReservas();
      setEditSuccess(true); 
    } catch (error) {
      console.error("Error al actualizar la reserva: ", error);
      setValidationError("Los valores ingresados no son válidos");
    }
  };

  const handleDelete = async () => {
    try {
      await removeReserva(currentReserva.id_reserva);
      handleDeleteClose();
      fetchReservas();
      setDeleteSuccess(true); 
    } catch (error) {
      setDeleteError("No se puede borrar la reserva.");
      console.error("Error al eliminar la reserva: ", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 min-h-screen">
        <h1 className="text-4xl text-center text-blue-100 mb-4">Reservas</h1>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-between items-center mb-4">
        </div>

        <TableReservas
            reservas={reservasConNombre}
            handleOpen={handleEditOpen}
            handleDelete={handleDeleteOpen}
        />

        {editOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleEditClose}>
                <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold mb-4">Editar Reserva</h2>
                    {validationError && <div className="text-red-500 mb-4">{validationError}</div>}
                    <div className="mb-4">
                      <label htmlFor="rut" className="block text-sm text-gray-500 dark:text-gray-300">Docente</label>
                      <select
                        name="rut"
                        id="rut"
                        value={currentReserva?.usuario || ''}
                        onChange={handleEditInputChange}
                        className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
                      >
                        {rutsDocentes.map((docente) => (
                          <option key={docente.rut} value={docente.rut}>
                            {`${docente.nombre} ${docente.apellido} (${docente.rut})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="id_asignatura" className="block text-sm text-gray-500 dark:text-gray-300">Asignatura</label>
                      <select
                        name="id_asignatura"
                        id="id_asignatura"
                        value={currentReserva?.id_asignatura || ''}
                        onChange={handleEditInputChange}
                        className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
                      >
                        {asignaturas.map((asignatura) => (
                          <option key={asignatura.id_asignatura} value={asignatura.id_asignatura}>
                            {asignatura.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="id_curso" className="block text-sm text-gray-500 dark:text-gray-300">Curso</label>
                      <select
                        name="id_curso"
                        id="id_curso"
                        value={currentReserva?.id_curso || ''}
                        onChange={handleEditInputChange}
                        className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
                      >
                        {cursos.map((curso) => (
                          <option key={curso.id_curso} value={curso.id_curso}>
                            {curso.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="id_lab" className="block text-sm text-gray-500 dark:text-gray-300">Laboratorio</label>
                        <select
                            name="id_lab"
                            id="id_lab"
                            value={currentReserva?.id_lab || ''}
                            onChange={handleEditInputChange}
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
                        >
                            {laboratorios.map((lab) => (
                                <option key={lab.id_lab} value={lab.id_lab}>
                                    {lab.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="id_horario" className="block text-sm text-gray-500 dark:text-gray-300">Horario</label>
                      <select
                        name="id_horario"
                        id="id_horario"
                        value={currentReserva?.id_horario || ''} 
                        onChange={handleEditInputChange}
                        className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
                      >
                        {horarios.map((horario) => (
                          <option key={horario.id_horario} value={horario.id_horario}>
                            {`${horario.hora_inicio} - ${horario.hora_fin}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fecha" className="block text-sm text-gray-500 dark:text-gray-300">Fecha</label>
                        <input
                            name="fecha"
                            type="date"
                            value={currentReserva?.fecha || ''}
                            onChange={handleEditInputChange}
                            placeholder="Fecha"
                            className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-100 px-4 py-2 focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <button onClick={handleEditSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                </div>
            </div>
        )}

        {deleteOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleDeleteClose}>
                <div className="bg-white dark:bg-[#111827] dark:text-white p-8 rounded-lg shadow-xl w-96" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
                    <p className="mb-4">
                      ¿Estás seguro de que deseas eliminar la reserva del profesor "{currentReserva?.usuario}" con
                      fecha "{currentReserva?.fecha}" en el horario "{currentReserva?.horario}"?
                    </p>
                    <div className="flex justify-around">
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Confirmar</button>
                        <button onClick={handleDeleteClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default Reservas;