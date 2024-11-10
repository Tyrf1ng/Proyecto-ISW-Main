import axios from './root.service.js';

export async function getAnotaciones() {
  try {
    const { data } = await axios.get('/anotaciones/'); // Ajusta la ruta según sea necesario
    return data.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function createAnotacion(data) {
    try {
      // Asegúrate de que la URL sea correcta
      const response = await axios.post('/anotaciones/crear/', data); // Ajusta según el prefijo de tu API
      return response.data;
    } catch (error) {
      console.error("Error al crear anotación: ", error);
      throw error;
    }
  }