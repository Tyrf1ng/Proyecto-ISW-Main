import axios from './root.service.js';

export async function getAsignaturasByProfesor(rut) {
  try {
    const { data } = await axios.get(`/asignaturas/profesor/${rut}`);
    if (data && data.data) {
      return data.data;  
    } else {
      console.error("Respuesta inesperada al obtener asignaturas.");
      throw new Error("No se encontraron asignaturas.");
    }
  } catch (error) {
    console.error("Error al obtener asignaturas por profesor: ", error);
    throw error;  
  }
}

export async function getNombreAsignaturaById(id_asignatura) {
  try {
    const { data } = await axios.get(`/asignaturas/nombre/${id_asignatura}`);
    if (data && data.data) {
      return data.data;  
    } else {
      console.error("Respuesta inesperada al obtener el nombre de la asignatura.");
      throw new Error("No se encontró el nombre de la asignatura.");
    }
  } catch (error) {
    console.error("Error al obtener el nombre de la asignatura: ", error);
    throw error;  
  }
}

export async function getAsignaturasByAlumno(rut) {
  try {
    const { data } = await axios.get(`/asignaturas/alumno/${rut}`);
    if (data && data.data) {
      return data.data;
    } else {
      console.error("Respuesta inesperada al obtener asignaturas.");
      throw new Error("No se encontraron asignaturas.");
    }
  } catch (error) {
    console.error("Error al obtener asignaturas por alumno: ", error);
    throw error;
  }
}

// Nueva función para crear una asignatura
export async function createAsignatura(rut_docente, nombre) {
  try {
    const { data } = await axios.post('/asignaturas/crear', { rut_docente, nombre });
    return data.data;
  } catch (error) {
    console.error('Error al crear la asignatura:', error);
    throw error.response?.data || { message: error.message };
  }
}
