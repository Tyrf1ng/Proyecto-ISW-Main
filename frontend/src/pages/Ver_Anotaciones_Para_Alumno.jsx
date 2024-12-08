import { useState, useContext, useEffect } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { getAnotacionesAlumno } from '@services/anotaciones.service.js';
import TableAnotacionComponent from '../components/Table';

const Ver_Anotaciones_Para_Alumno = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const [anotaciones, setAnotaciones] = useState([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    } else {
      const fetchAnotaciones = async () => {
        try {
          if (usuario?.rut) {
            const anotacionesAlumno = await getAnotacionesAlumno(usuario.rut);
            setAnotaciones(anotacionesAlumno);
          }
        } catch (error) {
          console.error('Error al obtener las anotaciones del alumno:', error);
        }
      };

      fetchAnotaciones();
    }
  }, [usuario, cargarUsuario]);

  if (!usuario) {
    return <div>Cargando usuario...</div>;
  }

  const handleFilterChange = (e) => setFilterText(e.target.value);

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
        role={usuario?.rol}
      />
    </div>
  );
};

export default Ver_Anotaciones_Para_Alumno;
