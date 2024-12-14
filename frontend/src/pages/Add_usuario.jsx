import { useState, useEffect } from 'react';
import { createUsuario } from '../services/usuarios.service';
import { useRut, checkRut, removeSeparators } from "react-rut-formatter";
import WarningAlert from '../components/WarningAlert';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import { getCursos, createConectUsuarioCurso } from '../services/cursos.service';
import { encryptPassword } from "../../../backend/src/helpers/bcrypt.helper";

function Add_alumno() {
  const [newAlumno, setNewAlumno] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
    password: '',
    id_roles: '3',
  });

  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const { rut, updateRut, isValid } = useRut();

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await getCursos();
        setCursos(data);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlumno({ ...newAlumno, [name]: value });
  };

  const handleTelefonoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    setNewAlumno({ ...newAlumno, telefono: value });
  };

  const handleNombreChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNewAlumno({ ...newAlumno, nombre: value });
  };

  const handleApellidoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNewAlumno({ ...newAlumno, apellido: value });
  };

  const validateRut = () => {
    if (!isValid || !checkRut(rut.raw)) {
      setAlert({ message: 'El RUT ingresado no es válido.', type: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateRut()) return;

    if (!newAlumno.nombre || !newAlumno.apellido || !newAlumno.email || !newAlumno.telefono || !newAlumno.password) {
      setAlert({ message: 'Debe completar todos los campos obligatorios.', type: 'warning' });
      return;
    }

    if (!selectedCurso) {
      setAlert({ message: 'Debe seleccionar un curso.', type: 'warning' });
      return;
    }

    try {
      // Normaliza el RUT y encripta la contraseña
      const cleanRut = removeSeparators(rut.raw);
      const encryptedPassword = await encryptPassword(newAlumno.password);

      const alumnoConDatosProcesados = {
        ...newAlumno,
        rut: cleanRut, // RUT sin separadores
        password: encryptedPassword,
      };

      await createUsuario(alumnoConDatosProcesados);
      const relacion = await createConectUsuarioCurso(cleanRut, selectedCurso);

      if (relacion && relacion.id_curso && relacion.rut) {
        setAlert({ message: 'Alumno añadido y conectado al curso exitosamente.', type: 'success' });
      } else {
        setAlert({ message: 'Alumno creado, pero hubo un error al conectarlo al curso.', type: 'warning' });
      }

      // Resetea los campos del formulario
      setNewAlumno({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rut: '',
        password: '',
        id_roles: '3',
      });
      setSelectedCurso('');
      updateRut('');

    } catch (error) {
      console.error('Error al añadir el alumno o conectarlo al curso:', error);
      setAlert({ message: 'Hubo un error al añadir el alumno o conectarlo al curso.', type: 'error' });
    }
  };

  const inputClass =
    'mt-2 block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300';

  return (
    <div className="flex py-10 justify-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Añadir Alumno</h2>
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label htmlFor='nombre' className='block text-sm text-gray-500 dark:text-gray-300'>
              Nombre
            </label>
            <input
              type='text'
              name='nombre'
              placeholder='Juan'
              value={newAlumno.nombre}
              onChange={handleNombreChange}
              className={inputClass}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor='apellido' className='block text-sm text-gray-500 dark:text-gray-300'>
              Apellido
            </label>
            <input
              type='text'
              name='apellido'
              placeholder='Pérez'
              value={newAlumno.apellido}
              onChange={handleApellidoChange}
              className={inputClass}
            />
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm text-gray-500 dark:text-gray-300'>
            Email
          </label>
          <input
            type='email'
            name='email'
            placeholder='email@prueba.cl'
            value={newAlumno.email}
            onChange={handleInputChange}
            className={inputClass}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='block text-sm text-gray-500 dark:text-gray-300'>
            Contraseña
          </label>
          <input
            type='password'
            name='password'
            placeholder='********'
            value={newAlumno.password}
            onChange={handleInputChange}
            className={inputClass}
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label htmlFor='telefono' className='block text-sm text-gray-500 dark:text-gray-300'>
              Teléfono
            </label>
            <input
              type='text'
              name='telefono'
              placeholder='87654321'
              value={newAlumno.telefono}
              onChange={handleTelefonoChange}
              className={inputClass}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor='rut' className='block text-sm text-gray-500 dark:text-gray-300'>
              RUT
            </label>
            <input
              type='text'
              name='rut'
              placeholder='12345678-9'
              value={rut.formatted} // Presentación
              onChange={(e) => {
                updateRut(e.target.value); // Actualización visual
              }}
              className={inputClass}
            />
          </div>
        </div>
        <div className='mb-4'>
          <label htmlFor='curso' className='block text-sm text-gray-500 dark:text-gray-300'>
            Seleccionar Curso
          </label>
          <select
            name='curso'
            value={selectedCurso}
            onChange={(e) => setSelectedCurso(e.target.value)}
            className={inputClass}
          >
            <option value=''>-- Seleccionar --</option>
            {cursos.map((curso) => (
              <option key={curso.id_curso} value={curso.id_curso}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-center'>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none'
          >
            Crear Alumno y Conectar a Curso
          </button>
        </div>
        {alert.type === 'warning' && <WarningAlert message={alert.message} />}
        {alert.type === 'success' && <SuccessAlert message={alert.message} />}
        {alert.type === 'error' && <ErrorAlert message={alert.message} />}
      </div>
    </div>
  );
}

export default Add_alumno;
