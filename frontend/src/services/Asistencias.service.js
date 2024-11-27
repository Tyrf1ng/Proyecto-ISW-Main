import axios from './root.service.js';

export async function getAsistenciasCurso(id_curso) {
  try {
    const { data } = await axios.get(`/asistencias/curso/${id_curso}`);
    return data.data; // Ajusta según cómo se devuelvan los datos desde tu API
  } catch (error) {
    console.error("Error al obtener asistencias del curso:", error);
    throw error;
  }
}
export async function createAsistencia(data) {
  try {
    const response = await axios.post('/asistencias/crear/', data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la asistencia:", error);
    throw error;
  }
}

export const getAsistenciasPorAlumno = async (rutAlumno) => {
  try {
    const response = await axios.get(`/asistencias/alumno/${rutAlumno}`);
    return response.data?.data || []; // Asegúrate de manejar correctamente la estructura de respuesta
  } catch (error) {
    console.error("Error al obtener las asistencias por alumno:", error);
    throw error;
  }
};
