import { useState } from 'react';
import { createUsuario } from '../services/usuarios.service';
import { useRut } from "react-rut-formatter";

function Add_alumno() {
  const [newAlumno, setNewAlumno] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '', // Solo aplicable para alumnos
    password: '', // Contraseña para el alumno
    id_roles: '3', // Rol fijo para "Alumno"
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Usamos useRut para formatear y validar el campo de RUT
  const { rut, updateRut, isValid } = useRut();

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlumno({ ...newAlumno, [name]: value });
  };

  const validateRut = () => {
    if (!isValid) {
      setMessage('El RUT ingresado no es válido.');
      setMessageType('warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!validateRut()) return;

    if (!newAlumno.nombre || !newAlumno.apellido || !newAlumno.email || !newAlumno.telefono || !newAlumno.password) {
      setMessage('Debe completar todos los campos obligatorios.');
      setMessageType('warning');
      return;
    }

    try {
      await createUsuario(newAlumno);
      setMessage('Alumno añadido exitosamente.');
      setMessageType('success');
      setNewAlumno({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rut: '',
        password: '',
        id_roles: '3',
      });
    } catch (error) {
      console.error('Error al añadir el alumno:', error);
      setMessage('Hubo un error al añadir el alumno.');
      setMessageType('error');
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    const messageClasses =
      'fixed top-5 right-5 w-full max-w-sm overflow-hidden bg-[#111827] rounded-lg shadow-md z-50 animate-bounce-slow';
    return (
      <div className={messageClasses}>
        <div className='px-4 py-2 -mx-3'>
          <div className='mx-3'>
            <span
              className={`font-semibold ${
                messageType === 'success'
                  ? 'text-emerald-500'
                  : messageType === 'error'
                  ? 'text-red-500'
                  : 'text-yellow-400'
              }`}
            >
              {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
            </span>
            <p className='text-sm text-gray-100'>{message}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6'>Añadir Alumno</h2>

      <div className='mb-4'>
        <label htmlFor='nombre' className='block text-sm text-gray-500 dark:text-gray-300'>
          Nombre
        </label>
        <input
          type='text'
          name='nombre'
          placeholder='Juan'
          value={newAlumno.nombre}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='apellido' className='block text-sm text-gray-500 dark:text-gray-300'>
          Apellido
        </label>
        <input
          type='text'
          name='apellido'
          placeholder='Pérez'
          value={newAlumno.apellido}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
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
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='telefono' className='block text-sm text-gray-500 dark:text-gray-300'>
          Teléfono
        </label>
        <input
          type='text'
          name='telefono'
          placeholder='987654321'
          value={newAlumno.telefono}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
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
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      {/* Campo RUT con formato */}
      <div className='mb-4'>
        <label htmlFor='rut' className='block text-sm text-gray-500 dark:text-gray-300'>
          RUT
        </label>
        <input
          type='text'
          name='rut'
          placeholder='12345678-9'
          value={rut.formatted}
          onChange={(e) => {
            updateRut(e.target.value); // Actualizar el RUT mientras el usuario escribe
            setNewAlumno({ ...newAlumno, rut: e.target.value });
          }}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      <button
        onClick={handleSubmit}
        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none'
      >
        Crear Alumno
      </button>

      {renderMessage()}
    </div>
  );
}

export default Add_alumno;
