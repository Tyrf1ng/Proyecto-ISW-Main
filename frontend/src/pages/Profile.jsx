import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUsuarioInfo from '@hooks/useUsuario';
import { updateUsuario } from '../services/usuarios.service';

function Profile() {
  const navigate = useNavigate();
  const { usuario } = useUsuarioInfo();
  const [updatedUser, setUpdatedUser] = useState({
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    email: usuario.email || '',
    direccion: usuario.direccion || '',
    comuna: usuario.comuna || '',
    telefono: usuario.telefono || '',
  });

  console.log(usuario);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUsuario(usuario.rut); // `usuario.rut` es el identificador
      alert('Perfil actualizado correctamente');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Hubo un error al actualizar el perfil. Por favor, intenta de nuevo.');
    }
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
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-4">
              {['nombre', 'apellido', 'email', 'direccion', 'comuna', 'telefono'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="text-gray-700 dark:text-gray-200 capitalize">
                    {field}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    value={updatedUser[field]}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                  />
                </div>
              ))}
            </div>
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
