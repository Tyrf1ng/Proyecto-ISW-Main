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

export const getAnotacionesPorCursoYAsignatura = async (idCurso, idAsignatura) => {
  try {
    const response = await axios.get(`/anotaciones/curso/${idCurso}/asignatura/${idAsignatura}`);
    return response.data.data; // Asumiendo que el backend envía los datos en { data: ... }
  } catch (error) {
    console.error('Error al obtener anotaciones por curso y asignatura:', error);
    throw new Error('No se pudieron cargar las anotaciones');
  }
};

export const getAnotacionesPorRutYAsignatura = async (rut, id_asignatura) => {
  try {
    const response = await axios.get(`/anotaciones/rut/${rut}/asignatura/${id_asignatura}`);
    return response.data; // { status: "Success", message: "...", data: [...] }
  } catch (error) {
    console.error('Error al obtener anotaciones por RUT y asignatura:', error);
    // Extraer el mensaje de error del backend si está disponible
    const message = error.response?.data?.message || 'No se pudieron cargar las anotaciones';
    throw new Error(message);
  }
};