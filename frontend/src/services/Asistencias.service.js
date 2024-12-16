import axios from './root.service.js';

export async function getAsistenciasProfesor(id_profesor, id_curso, id_asignatura) {
  try {
    const response = await axios.get(`/asistencias/profesor/${id_profesor}/curso/${id_curso}/asignatura/${id_asignatura}`);
    return response.data; 
  } catch (error) {
    console.error("Error al obtener asistencias del profesor:", error);
    throw error;
  }
}

export async function getAsistenciasEstudiante(rutEstudiante) {
  try {
    const response = await axios.get(`/asistencias/estudiante/${rutEstudiante}`); // Asegúrate de que la ruta coincide con la del backend
    return response.data; // Retorna los datos directamente
  } catch (error) {
    console.error("Error al obtener asistencias del estudiante:", error);
    throw error;
  }
}



export async function getAsistencia(idAsistencia) {
  try {
    const { data } = await axios.get(`/asistencias/${idAsistencia}`);
    return data.data; 
  } catch (error) {
    console.error("Error al obtener la asistencia:", error);
    throw error;
  }
}

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
    const { tipo, observacion } = asistencia;
    const response = await axios.patch(`/asistencias/actualizar/${asistencia.id_asistencia}`, { tipo, observacion });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la asistencia:", error.response ? error.response.data : error.message);
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