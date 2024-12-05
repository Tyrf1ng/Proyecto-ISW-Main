import { useEffect, useState } from 'react';
import { createUsuario, getUsuarios, updateUsuario, deleteUsuario } from '../services/user.service';

function Add_Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [newUsuario, setNewUsuario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    rol: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);

  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData);
        setFilteredUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      }
    };
    cargarUsuarios();
  }, []);

  // Manejar búsqueda de usuarios
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = usuarios.filter((usuario) =>
      `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(query)
    );
    setFilteredUsuarios(filtered);
  };

  // Manejar cambios en el formulario de usuario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario({ ...newUsuario, [name]: value });
  };

  // Manejar la selección de un usuario
  const handleSelectUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setNewUsuario({ ...usuario });
  };

  // Crear un nuevo usuario
  const handleCreate = async () => {
    if (!newUsuario.nombre || !newUsuario.apellido || !newUsuario.correo || !newUsuario.rol) {
      setMessage('Debe completar todos los campos.');
      setMessageType('warning');
      return;
    }

    try {
      const createdUsuario = await createUsuario(newUsuario);
      setMessage('Usuario creado exitosamente.');
      setMessageType('success');
      setUsuarios([...usuarios, createdUsuario]);
      setNewUsuario({ nombre: '', apellido: '', correo: '', rol: '' });
    } catch (error) {
      setMessage('Hubo un error al crear el usuario.');
      setMessageType('error');
    }
  };

  // Actualizar un usuario
  const handleUpdate = async () => {
    if (!newUsuario.nombre || !newUsuario.apellido || !newUsuario.correo || !newUsuario.rol) {
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
      setNewUsuario({ nombre: '', apellido: '', correo: '', rol: '' });
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
      <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6'>Gestión de Usuarios</h2>

      {/* Búsqueda de usuario */}
      <div className='mb-4'>
        <label htmlFor='search' className='block text-sm text-gray-500 dark:text-gray-300'>
          Buscar Usuario
        </label>
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Buscar por nombre'
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      {/* Crear/Actualizar Usuario */}
      <div className='mb-4'>
        <label htmlFor='nombre' className='block text-sm text-gray-500 dark:text-gray-300'>
          Nombre
        </label>
        <input
          type='text'
          name='nombre'
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
          value={newUsuario.apellido}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='correo' className='block text-sm text-gray-500 dark:text-gray-300'>
          Correo
        </label>
        <input
          type='email'
          name='correo'
          value={newUsuario.correo}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='rol' className='block text-sm text-gray-500 dark:text-gray-300'>
          Rol
        </label>
        <select
          name='rol'
          value={newUsuario.rol}
          onChange={handleInputChange}
          className='mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-4 py-2 focus:ring focus:ring-blue-300'
        >
          <option value=''>Seleccionar rol</option>
          <option value='Alumno'>Alumno</option>
          <option value='Profesor'>Profesor</option>
          <option value='Directivo'>Directivo</option>
        </select>
      </div>

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

      {/* Lista de usuarios */}
      <div className='mt-6'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>Usuarios</h3>
        <ul className='mt-4'>
          {filteredUsuarios.map((usuario) => (
            <li
              key={usuario.id}
              className='px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700 text-gray-800 dark:text-white'
              onClick={() => handleSelectUsuario(usuario)}
            >
              {usuario.nombre} {usuario.apellido}
            </li>
          ))}
        </ul>
      </div>

      {renderMessage()}
    </div>
  );
}

export default Add_Usuarios;
