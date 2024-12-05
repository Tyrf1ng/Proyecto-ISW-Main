import axios from './root.service.js';

// Obtener asignaturas por profesor (usando RUT del profesor)
export async function getAsignaturasByProfesor(rut) {
  try {
    // Realizamos la petición GET para obtener las asignaturas del profesor
    const { data } = await axios.get(`/asignaturas/profesor/${rut}`);
    
    // Comprobamos si la respuesta es válida y retornamos las asignaturas
    if (data && data.data) {
      return data.data;  // Retornamos el array de asignaturas
    } else {
      console.error("Respuesta inesperada al obtener asignaturas.");
      throw new Error("No se encontraron asignaturas.");
    }
  } catch (error) {
    console.error("Error al obtener asignaturas por profesor: ", error);
    throw error;  // Lanzamos el error para que el frontend pueda manejarlo
  }
}