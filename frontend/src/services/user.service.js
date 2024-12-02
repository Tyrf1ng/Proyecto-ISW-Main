import axios from './root.service.js';

/**
 * Obtiene información de un usuario basado en su rut.
 * @param {string} rut - El rut del usuario.
 * @returns {Promise<Object>} - Información del usuario.
 */
export async function getUsuario(rut) {
    try {
        const { data } = await axios.get(`/usuarios/rut/${rut}`);
        return data.data; // Devuelve los datos del usuario obtenidos de la API
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw new Error(error.response?.data?.message || 'No se pudo obtener el usuario.');
    }
}

/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array>} - Lista de usuarios.
 */
export async function getUsuarios() {
    try {
        const { data } = await axios.get('/usuarios');
        return data.data; // Devuelve la lista de usuarios obtenida de la API
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw new Error(error.response?.data?.message || 'No se pudo obtener la lista de usuarios.');
    }
}

/**
 * Crea un nuevo usuario.
 * @param {Object} usuario - Objeto con los datos del usuario a crear.
 * @returns {Promise<Object>} - Usuario creado.
 */
export async function createUsuario(usuario) {
    try {
        const { data } = await axios.post('/usuarios', usuario);
        return data.data; // Devuelve el usuario creado
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw new Error(error.response?.data?.message || 'No se pudo crear el usuario.');
    }
}

/**
 * Actualiza un usuario existente.
 * @param {string} rut - El rut del usuario a actualizar.
 * @param {Object} usuario - Objeto con los datos actualizados del usuario.
 * @returns {Promise<Object>} - Usuario actualizado.
 */
export async function updateUsuario(rut, usuario) {
    try {
        const { data } = await axios.put(`/usuarios/rut/${rut}`, usuario);
        return data.data; // Devuelve el usuario actualizado
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw new Error(error.response?.data?.message || 'No se pudo actualizar el usuario.');
    }
}

/**
 * Elimina un usuario por su rut.
 * @param {string} rut - El rut del usuario a eliminar.
 * @returns {Promise<Object>} - Respuesta de la API sobre la eliminación.
 */
export async function deleteUsuario(rut) {
    try {
        const { data } = await axios.delete(`/usuarios/${rut}`);
        return data.data; // Devuelve la respuesta de la API
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw new Error(error.response?.data?.message || 'No se pudo eliminar el usuario.');
    }
}
