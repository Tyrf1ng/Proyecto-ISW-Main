import axios from './root.service.js';

// Obtener las asistencias de una asignatura específica en un curso específico
export async function getAsistenciasAsignatura(id_asignatura, id_curso) {
  try {
    const { data } = await axios.get(`/asistencias/asignatura/${id_asignatura}/curso/${id_curso}`);
    return data.data; // Ajusta según cómo se devuelvan los datos desde tu API
  } catch (error) {
    console.error("Error al obtener asistencias de la asignatura:", error);
    throw error;
  }
}

// Obtener las asistencias de un curso (ya no se usará para docentes)
export async function getAsistenciasCurso(id_curso) {
  try {
    const { data } = await axios.get(`/asistencias/curso/${id_curso}`);
    return data.data; 
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

export const getAsistenciasAlumnoFecha = async (rutAlumno, fecha, idAsignatura) => {
  try {
      const response = await axios.get(`/asistencias/alumno/${rutAlumno}/asignatura/${idAsignatura}/fecha/${fecha}`);
      return response.data?.data || null;
  } catch (error) {
      if (error.response && error.response.status === 404) {
          console.warn(`No hay asistencias para el alumno ${rutAlumno} en la fecha ${fecha} y asignatura ${idAsignatura}.`);
          return null; 
      }
      console.error("Error al obtener las asistencias por alumno en fecha:", error);
      throw error; 
  }
};

// Obtener las asistencias de un alumno para una asignatura específica
export const getAsistenciasAlumnoAsignatura = async (rut, id_asignatura ) => {
  try {
    const response = await axios.get(`/asistencias/alumno/${rut}/asignatura/${id_asignatura}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener las asistencias del alumno para la asignatura:", error);
    throw error;
  }
};

