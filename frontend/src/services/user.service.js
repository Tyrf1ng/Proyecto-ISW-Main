import axios from './root.service.js'; // Importamos axios

export async function updateUserProfile(userData) {
  try {
    const response = await axios.patch(`/user/update/${userData.email}`, userData); // Usamos PATCH para actualizar los datos
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario: ", error.response ? error.response.data : error.message);
    return error.response ? error.response.data : { error: error.message };
  }
}
