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

export async function getAnotacionesAlumno(rut) {
  try {
    const { data } = await axios.get(`/anotaciones/alumno/${rut}`);
    return data.data;
  } catch (error) {
    console.error('Error al obtener anotaciones del alumno:', error);
    throw error;
  }
}
