import axios from './root.service.js';



// Obtener las asistencias de un alumno para una fecha, se utiliza al momento de crear una asistencia para verificar si ya existe una asistencia para ese alumno en esa fecha
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

// Actualizar una asistencia
export async function updateAsistencia(asistencia) {
  try {
    if (!asistencia.id_asistencia) {
      throw new Error("ID de asistencia es requerido");
    }
    const { tipo, observacion } = asistencia;
    const response = await axios.patch(`/asistencias/actualizar/${asistencia.id_asistencia}`, { tipo, observacion });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la asistencia:", error.response ? error.response.data : error.message);
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

//Nuevas funciones para obtener asistencias de un curso
export const getAsistenciasPorCursoYAsignatura = async (idCurso, idAsignatura) => {
  try {
    const response = await axios.get(`/asistencias/curso/${idCurso}/asignatura/${idAsignatura}`);
    return response.data.data;

  } catch (error) {
    console.error("Error al obtener las asistencias por curso y asignatura:", error);
    throw new Error('No se puedieron cargar las asistencias');
  }
};

// Obtener asistencias por RUT y Asignatura
export const getAsistenciasPorRutyAsignatura = async (rut, idAsignatura) => {
  try {
    const response = await axios.get(`/asistencias/rut/${rut}/asignatura/${idAsignatura}`);
    return response.data; // { message, data: [asistencias] }
  } catch (error) {
    const message = error.response?.data?.message || 'No se pudieron cargar las asistencias';
    throw new Error(message);
  }
};