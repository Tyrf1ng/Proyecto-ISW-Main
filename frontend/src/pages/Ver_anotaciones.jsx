import { useState, useContext, useEffect } from 'react';
import { CursoContext } from '../context/CursoContext';
import { UsuarioContext } from '../context/UsuarioContext';
import useAnotaciones from '@hooks/anotaciones/useAnotaciones';
import { createAnotacion, deleteAnotacion, updateAnotacion } from '@services/anotaciones.service.js';
import { getAlumnosByCurso } from '@services/alumnos.service'; 
import TableAnotacionComponent from '../components/Table';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Ver_anotaciones = () => {
  const { curso } = useContext(CursoContext);
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { anotaciones, fetchAnotaciones } = useAnotaciones();
  
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState(''); // Estado para el filtro de fecha
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

  const handleDateFilterChange = (e) => setFilterDate(e.target.value); // Función para cambiar el valor de la fecha

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
      // Si estamos en modo edición, buscamos el alumno relacionado con la anotación
      const alumno = alumnos.find(a => a.rut === anotacion.rut);
      setSearchTerm(alumno ? `${alumno.nombre} ${alumno.apellido}` : ''); // Seteamos el nombre del alumno en el campo de búsqueda
    }

    setNewAnotacion(anotacion || {
      tipo: 'Positiva',
      rut: '',
      descripcion: '',
      id_asignatura: curso.idCurso || '',
      createdAt: new Date().toISOString(),
    });

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

  // Función para filtrar las anotaciones por descripción y fecha
  const filterAnotaciones = (anotaciones) => {
    // Convertir la fecha seleccionada del filtro a solo fecha (sin hora)
    const filterDateFormatted = filterDate ? new Date(filterDate).toISOString().split('T')[0] : null;

    return anotaciones.filter((anotacion) => {
      // Convertir la fecha de la anotación a solo fecha (sin hora)
      const anotacionDateFormatted = anotacion.createdAt ? new Date(anotacion.createdAt).toISOString().split('T')[0] : null;

      const descriptionMatch = anotacion.descripcion.toLowerCase().includes(filterText.toLowerCase());
      const dateMatch = filterDateFormatted ? anotacionDateFormatted === filterDateFormatted : true;

      return descriptionMatch && dateMatch;
    });
  };

  // Contar anotaciones positivas y negativas de las filtradas
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

  // Filtramos las anotaciones visibles
  const filteredAnotaciones = filterAnotaciones(anotaciones);
  const { positivas, negativas } = countAnotacionesTipo(filteredAnotaciones);

  const data = [
    { name: 'Positivas', value: positivas },
    { name: 'Negativas', value: negativas },
  ];

  const COLORS = ['#10B981', '#EF4444'];
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      {/* Contenedor principal con Flexbox */}
      <div className="flex flex-wrap gap-6">
        
        {/* Card de anotaciones (ocupa la mayor parte del espacio) */}
        <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-6">
          {/* Filtros */}
<div className="flex mb-4 justify-between">
  <div className="w-1/2">
    <input
      type="text"
      value={filterText}
      onChange={handleFilterChange}
      placeholder="Filtrar por descripción"
      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500" // Cambié el borde y añadí foco
    />
  </div>

  {/* Filtro por Fecha */}
  <div className="w-1/8">
    <input
      type="date"
      value={filterDate}
      onChange={handleDateFilterChange}
      className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500" // Igual que el anterior
    />
  </div>
</div>

          {/* Tabla de anotaciones */}
          <TableAnotacionComponent
            anotaciones={filteredAnotaciones} // Filtramos las anotaciones aquí
            handleOpen={handleOpenModal}
            handleDelete={handleDeleteRequest}
            role={usuario?.rol}
          />
        </div>

        {/* Card para el gráfico de anotaciones (ocupa 1/3 del espacio) */}
        <div className="w-full md:w-1/5 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Anotaciones totales</h2>
          {/* Contadores de anotaciones */}
          <div className="flex flex-row items-center text-gray-600 mb-4">
          <div className="flex flex-col w-1/2 items-center text-green-600 mb-4">
            <span className="text-3xl font-bold">{positivas}</span>
            <span className="text-sm">Positivas</span>
          </div>
          <div className="flex w-1/2 flex-col items-center text-red-600 mb-6">
            <span className="text-3xl font-bold">{negativas}</span>
            <span className="text-sm">Negativas</span>
          </div>
          </div>

          {/* Gráfico de torta */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal para editar o agregar anotación */}
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

      {/* Confirmación de eliminación */}
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
