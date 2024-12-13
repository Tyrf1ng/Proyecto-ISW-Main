import { useState, useEffect } from 'react';
import { createUsuario } from '../services/usuarios.service';
import { useRut } from "react-rut-formatter";
import WarningAlert from '../components/WarningAlert';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';

function Add_enc_lab() {
  const [newEncLab, setNewEncLab] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rut: '',
    password: '',
    id_roles: '4',
  });

  const [alert, setAlert] = useState({
    message: '',
    type: '',
  });

  const { rut, updateRut, isValid } = useRut();

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEncLab({ ...newEncLab, [name]: value });
  };

  const handleTelefonoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    setNewEncLab({ ...newEncLab, telefono: value });
  };

  const handleNombreChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNewEncLab({ ...newEncLab, nombre: value });
  };

  const handleApellidoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNewEncLab({ ...newEncLab, apellido: value });
  };

  const validateRut = () => {
    if (!isValid) {
      setAlert({
        message: 'El RUT ingresado no es válido.',
        type: 'warning',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateRut()) return;

    if (!newEncLab.nombre || !newEncLab.apellido || !newEncLab.email || !newEncLab.telefono || !newEncLab.password) {
      setAlert({
        message: 'Debe completar todos los campos obligatorios.',
        type: 'warning',
      });
      return;
    }

    try {
      await createUsuario(newEncLab);

      setAlert({
        message: 'Encargado de laboratorio añadido exitosamente.',
        type: 'success',
      });

      setNewEncLab({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rut: '',
        password: '',
        id_roles: '4',
      });
      updateRut('');

    } catch (error) {
      console.error('Error al añadir el encargado de laboratorio:', error);
      setAlert({
        message: 'Hubo un error al añadir el encargado de laboratorio.',
        type: 'error',
      });
    }
  };

  const inputClass =
    'mt-2 block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300';

  return (
    <div className="flex py-10 justify-center bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Añadir Encargado de Laboratorio</h2>
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label htmlFor='nombre' className='block text-sm text-gray-500 dark:text-gray-300'>
              Nombre
            </label>
            <input
              type='text'
              name='nombre'
              placeholder='Juan'
              value={newEncLab.nombre}
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
              value={newEncLab.apellido}
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
            value={newEncLab.email}
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
            value={newEncLab.password}
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
              value={newEncLab.telefono}
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
              value={rut.formatted}
              onChange={(e) => {
                updateRut(e.target.value);
                setNewEncLab({ ...newEncLab, rut: e.target.value });
              }}
              className={inputClass}
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <button
            onClick={handleSubmit}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none'
          >
            Crear Encargado de Laboratorio
          </button>
        </div>
        {alert.type === 'warning' && <WarningAlert message={alert.message} />}
        {alert.type === 'success' && <SuccessAlert message={alert.message} />}
        {alert.type === 'error' && <ErrorAlert message={alert.message} />}
      </div>
    </div>
  );
}

export default Add_enc_lab;
