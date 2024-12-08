import {  useState } from 'react';
import { createUsuario,  updateUsuario, deleteUsuario } from '../services/usuarios.service';

function Add_Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    asignatura: '', 
    rut: '', 
    id_roles: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  // Manejar cambios en el formulario de usuario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario({ ...newUsuario, [name]: value });
  };

  // Crear un nuevo usuario
  const handleCreate = async () => {
    if (!newUsuario.nombre || !newUsuario.apellido || !newUsuario.email || !newUsuario.telefono || !newUsuario.password || !newUsuario.id_roles || 
        (newUsuario.id_roles === 'Alumno' && !newUsuario.rut) ||
        (newUsuario.id_roles === 'Profesor' && !newUsuario.asignatura)) {
      setMessage('Debe completar todos los campos.');
      setMessageType('warning');
      return;
    }

    try {
      const createdUsuario = await createUsuario(newUsuario);
      setMessage('Usuario creado exitosamente.');
      setMessageType('success');
      setUsuarios([...usuarios, createdUsuario]);
      setNewUsuario({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: '',
        asignatura: '',
        rut: '',
        id_roles: '',
      });
    } catch (error) {
      setMessage('Hubo un error al crear el usuario.');
      setMessageType('error');
    }
  };

  // Actualizar un usuario
  const handleUpdate = async () => {
    if (!newUsuario.nombre || !newUsuario.apellido || !newUsuario.email || !newUsuario.id_roles || 
        (newUsuario.id_roles === 'Alumno' && !newUsuario.rut) ||
        (newUsuario.id_roles === 'Profesor' && !newUsuario.asignatura)) {
      setMessage('Debe completar todos los campos.');
      setMessageType('warning');
      return;
    }

    try {
      const updatedUsuario = await updateUsuario(selectedUsuario.id, newUsuario);
      setMessage('Usuario actualizado exitosamente.');
      setMessageType('success');
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.id === selectedUsuario.id ? updatedUsuario : usuario
        )
      );
      setSelectedUsuario(null);
      setNewUsuario({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: '',
        asignatura: '',
        rut: '',
        id_roles: '',
      });
    } catch (error) {
      setMessage('Hubo un error al actualizar el usuario.');
      setMessageType('error');
    }
  };

  // Eliminar un usuario
  const handleDelete = async (id) => {
    try {
      await deleteUsuario(id);
      setMessage('Usuario eliminado exitosamente.');
      setMessageType('success');
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      setMessage('Hubo un error al eliminar el usuario.');
      setMessageType('error');
    }
  };

  // Función para determinar el título dinámico
  const getPageTitle = () => {
    if (!newUsuario.id_roles) {
      return 'Añadir usuario';
    }
    switch (newUsuario.id_roles) {
      case 'Alumno':
        return 'Añadir estudiante';
      case 'Profesor':
        return 'Añadir profesor';
      case 'Directivo':
        return 'Añadir directivo';
      default:
        return 'Añadir usuario';
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
      <h2 className='text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6'>{getPageTitle()}</h2>

            {/* Selección del id_roles */}
            <div className='mb-4'>
        <label htmlFor='id_roles' className='block text-sm text-gray-500 dark:text-gray-300'>
          id_roles
        </label>
        <select
          name='id_roles'
          value={newUsuario.id_roles}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        >
          <option value=''>Seleccionar el rol</option>
          <option value='3'>Alumno</option>
          <option value='2'>Profesor</option>
          <option value='1'>Directivo</option>
        </select>
      </div>

      {/* Crear/Actualizar Usuario */}
      <div className='mb-4'>
        <label htmlFor='nombre' className='block text-sm text-gray-500 dark:text-gray-300'>
          Nombre
        </label>
        <input
          type='text'
          name='nombre'
          placeholder='Juan Antonio'
          value={newUsuario.nombre}
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
          placeholder='Pérez Pérez'
          value={newUsuario.apellido}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='email' className='block text-sm text-gray-500 dark:text-gray-300'>
          email
        </label>
        <input
          type='email'
          name='email'
          placeholder='email@prueba.cl'
          value={newUsuario.email}
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
          value={newUsuario.password}
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
          value={newUsuario.telefono}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>



        <div className='mb-4'>
          <label htmlFor='rut' className='block text-sm text-gray-500 dark:text-gray-300'>
            RUT
          </label>
          <input
            type='text'
            name='rut'
            placeholder='12345678-9'
            value={newUsuario.rut}
            onChange={handleInputChange}
            className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
          />
        </div>

      {/* Mostrar campo asignatura solo si es Profesor */}
      {newUsuario.id_roles === 'Profesor' && (
        <div className='mb-4'>
          <label htmlFor='asignatura' className='block text-sm text-gray-500 dark:text-gray-300'>
            Asignatura
          </label>
          <input
            type='text'
            name='asignatura'
            placeholder='Matemáticas'
            value={newUsuario.asignatura}
            onChange={handleInputChange}
            className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
          />
        </div>
      )}

      {/* Botones de creación y actualización */}
      <div className='flex space-x-4'>
        <button
          onClick={selectedUsuario ? handleUpdate : handleCreate}
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none'
        >
          {selectedUsuario ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
        {selectedUsuario && (
          <button
            onClick={() => handleDelete(selectedUsuario.id)}
            className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none'
          >
            Eliminar Usuario
          </button>
        )}
      </div>

      {renderMessage()}
    </div>
  );
}

export default Add_Usuarios;
