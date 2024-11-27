import axios from './root.service.js';

export async function getAnotacionesCurso(idCurso) {
  try {
    const { data } = await axios.get(`/anotaciones/curso/${idCurso}`);
    return data.data;
  } catch (error) {
    console.error("Error al obtener anotaciones del curso: ", error);
    throw error;
  }
}

export async function createAnotacion(data) {
  try {
    const response = await axios.post('/anotaciones/crear/', data);
    return response.data;
  } catch (error) {
    console.error("Error al crear anotación: ", error);
    throw error;
  }
}

// Agregar esta función si no está definida
export async function updateAnotacion(id, data) {
  try {
    const response = await axios.put(`/anotaciones/actualizar/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la anotación: ", error);
    throw error;
  }
}

export async function deleteAnotacion(id) {
  try {
    const response = await axios.delete(`/anotaciones/borrar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar anotación: ", error);
    throw error;
  }
}

export async function getAnotacionesAlumno(rutAlumno) {
  try {
    const { data } = await axios.get(`/anotaciones/alumno/${rutAlumno}`);
    return data.data; // Ajusta según la estructura de tu respuesta del backend
  } catch (error) {
    console.error('Error al obtener anotaciones del alumno:', error);
    throw error;
  }
}
