import { useState, useContext, useEffect } from 'react';
import { CursoContext } from '../context/CursoContext';
import { UsuarioContext } from '../context/UsuarioContext';
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import { createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';
import { getAlumnosByCurso } from '@services/alumnos.service'; // Asumimos que este servicio ya existe
import TableAnotacionComponent from '../components/Table';

const Ver_anotaciones = () => {
  const { curso } = useContext(CursoContext);
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { anotaciones, fetchAnotaciones } = useAnotaciones();
  
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAnotacion, setCurrentAnotacion] = useState(null);
  const [newAnotacion, setNewAnotacion] = useState({
    tipo: 'Positiva',
    rut_alumno: '',
    descripcion: '',
    id_asignatura: curso.idCurso || '',
    fecha: new Date().toISOString(),
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
          const alumnosData = await getAlumnosByCurso(curso.idCurso);
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
    setNewAnotacion(anotacion || {
      tipo: 'Positiva',
      rut_alumno: '',
      descripcion: '',
      id_asignatura: curso.idCurso || '',
      fecha: new Date().toISOString(),
    });
    setSearchTerm('');
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

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar anotaciones..."
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <TableAnotacionComponent
        anotaciones={anotaciones.filter((a) =>
          a.descripcion.toLowerCase().includes(filterText.toLowerCase())
        )}
        handleOpen={handleOpenModal}
        handleDelete={handleDeleteRequest}
        role={usuario?.rol}
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 rounded-lg shadow-xl w-96 bg-[#1F2937] text-black dark:bg-[#1F2937] dark:text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? 'Editar Anotación' : 'Nueva Anotación'}
            </h2>

            {/* Campo de búsqueda de alumno */}
            <div className="mb-4">
              <label htmlFor="alumno" className="block text-sm text-gray-500 dark:text-gray-300">
                Buscar Alumno
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleAlumnoSearchChange}
                placeholder="Buscar Alumno"
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-[#111827] dark:bg-[#111827] text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Lista de resultados */}
            {isListVisible && filteredAlumnos.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto">
                <ul className="mt-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                  {filteredAlumnos.map((alumno) => (
                    <li
                      key={alumno.rut}
                      onClick={() => handleAlumnoSelect(alumno)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white"
                    >
                      {alumno.nombre} {alumno.apellido}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Información de la anotación */}
            <div className="mb-4">
              <label htmlFor="tipo" className="block text-sm text-gray-500 dark:text-gray-300">
                Tipo de Anotación
              </label>
              <select
                name="tipo"
                id="tipo"
                value={newAnotacion.tipo}
                onChange={handleSelectChange}
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-[#111827] dark:bg-[#111827] text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300"
              >
                <option value="Positiva">Positiva</option>
                <option value="Negativa">Negativa</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-sm text-gray-500 dark:text-gray-300">
                Descripción
              </label>
              <textarea
                name="descripcion"
                id="descripcion"
                value={newAnotacion.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción"
                rows="4"
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-[#111827] dark:bg-[#111827] text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
                {isEditMode ? 'Actualizar' : 'Guardar'}
              </button>
              <button onClick={handleCloseModal} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 rounded-lg shadow-xl bg-white text-black dark:bg-[#111827] dark:text-white">
            <h2 className="text-2xl font-bold mb-4">¿Estás seguro de que deseas eliminar esta anotación?</h2>
            <div className="flex justify-between">
              <button onClick={handleConfirmDelete} className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg">
                Eliminar
              </button>
              <button onClick={() => setConfirmDialogOpen(false)} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ver_anotaciones;
