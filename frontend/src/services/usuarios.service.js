import axios from './root.service.js';  // Asegúrate de que este archivo está configurado correctamente

// Obtener todos los usuarios
export async function getUsuarios() {
  try {
    const { data } = await axios.get('/usuarios');
    return data.data; // Asegúrate de que la estructura de la respuesta esté correcta
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Crear un nuevo usuario
export async function createUsuario(data) {
  try {
    const response = await axios.post('/usuarios/crear', data);
    return response.data; // Deberías recibir el usuario creado como respuesta
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Actualizar un usuario existente
export async function updateUsuario(id, data) {
  try {
    const response = await axios.put(`/usuarios/actualizar/${id}`, data);
    return response.data; // Deberías recibir el usuario actualizado como respuesta
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

// Eliminar un usuario
export async function deleteUsuario(id) {
  try {
    const response = await axios.delete(`/usuarios/borrar/${id}`);
    return response.data; // Deberías recibir un mensaje de éxito o estado como respuesta
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

// Obtener un usuario por su RUT (si es necesario)
export async function getUsuarioByRut(rut) {
  try {
    const { data } = await axios.get(`/usuarios/${rut}`);
    return data.data; // Asegúrate de que la estructura de la respuesta esté correcta
  } catch (error) {
    console.error('Error al obtener usuario por RUT:', error);
    throw error;
  }
}
