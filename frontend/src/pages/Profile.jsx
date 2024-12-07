import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  
  // Estado para almacenar los datos del perfil
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rut: ''
  });

  // Estado para gestionar los valores editados
  const [updatedUser, setUpdatedUser] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });

  // Obtener el usuario desde sessionStorage al cargar el componente
  useEffect(() => {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setUsuario({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        email: usuarioGuardado.email,
        rut: usuarioGuardado.rut, // Usamos el RUT para otras funcionalidades
      });

      // Prellenar los valores para la edición
      setUpdatedUser({
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        email: usuarioGuardado.email,
      });
    }
  }, []);

  // Manejo de cambios en los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejo del formulario para actualizar los datos
  const handleSubmit = (e) => {
    e.preventDefault();

    // Guardamos los cambios en sessionStorage
    sessionStorage.setItem('usuario', JSON.stringify({
      ...usuario,  // Mantenemos los valores no modificados
      ...updatedUser, // Actualizamos los valores modificados
    }));

    // Mensaje de confirmación y redirección si es necesario
    alert('Perfil actualizado correctamente');
    navigate('/inicio'); // O la ruta que prefieras después de actualizar
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="overflow-hidden justify-center bg-white dark:bg-gray-900 lg:mx-8 lg:flex lg:max-w-6xl lg:w-full lg:shadow-md lg:rounded-xl">
        <div className="max-w-xl px-6 py-12 lg:max-w-5xl lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Perfil de Usuario
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-300">
            Aquí puedes editar los detalles de tu cuenta.
          </p>

          {/* Formulario de edición */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="text-gray-700 dark:text-gray-200">Nombre</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={updatedUser.nombre}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label htmlFor="apellido" className="text-gray-700 dark:text-gray-200">Apellido</label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={updatedUser.apellido}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-gray-700 dark:text-gray-200">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={updatedUser.email}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                />
              </div>
            </div>

            {/* Botón de guardar cambios */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-600"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
