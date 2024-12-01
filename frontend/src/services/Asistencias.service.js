import axios from './root.service.js';

// Obtener las asistencias de un curso
export async function getAsistenciasCurso(id_curso) {
  try {
    const { data } = await axios.get(`/asistencias/curso/${id_curso}`);
    return data.data; // Ajusta según cómo se devuelvan los datos desde tu API
  } catch (error) {
    console.error("Error al obtener asistencias del curso:", error);
    throw error;
  }
}

// Crear una nueva asistencia
export async function createAsistencia(data) {
  try {
    const response = await axios.post('/asistencias/crear/', data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la asistencia:", error);
    throw error;
  }
}

// Eliminar una asistencia
export async function deleteAsistencia(id_asistencia) {
  try {
    if (!id_asistencia) {
      throw new Error("ID de asistencia es requerido para eliminar.");
    }
    const response = await axios.delete(`/asistencias/borrar/${id_asistencia}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la asistencia:", error);
    throw error;
  }
}

// Actualizar una asistencia
export async function updateAsistencia(asistencia) {
  try {
    if (!asistencia.id_asistencia) {
      throw new Error("ID de asistencia es requerido");
    }
    const response = await axios.patch(`/asistencias/actualizar/${asistencia.id_asistencia}`, asistencia);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la asistencia:", error);
    throw error;
  }
}

// Obtener las asistencias de un alumno
export const getAsistenciasPorAlumno = async (rutAlumno) => {
  try {
    const response = await axios.get(`/asistencias/alumno/${rutAlumno}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener las asistencias por alumno:", error);
    throw error;
  }
};
