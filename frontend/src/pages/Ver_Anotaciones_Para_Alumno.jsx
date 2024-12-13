import React, { useState, useContext, useEffect } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';
import { AsignaturaContext } from '../context/AsignaturaContext';
import { getAnotacionesPorRutYAsignatura } from '../services/anotaciones.service.js';
import TableAnotacionComponent from '../components/Table';

const Ver_Anotaciones_Para_Alumno = () => {
  const { usuario, cargarUsuario } = useContext(UsuarioContext);
  const { asignatura } = useContext(AsignaturaContext);

  const [anotaciones, setAnotaciones] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario) {
      cargarUsuario();
    } else {
      const fetchAnotaciones = async () => {
        try {
          if (usuario?.rut && asignatura?.idAsignatura) {
            const response = await getAnotacionesPorRutYAsignatura(usuario.rut, asignatura.idAsignatura);
            setAnotaciones(response.data);
            setError(null);
          } else {
            setAnotaciones([]);
            setError('No se ha seleccionado una asignatura.');
          }
        } catch (err) {
          setError(err.message || 'No se pudieron cargar las anotaciones.');
          setAnotaciones([]);
        }
      };

      fetchAnotaciones();
    }
  }, [usuario, cargarUsuario, asignatura]);

  if (!usuario) {
    return <div>Cargando usuario...</div>;
  }

  const handleFilterChange = (e) => setFilterText(e.target.value);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={handleFilterChange}
          placeholder="Filtrar anotaciones por descripción..."
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
