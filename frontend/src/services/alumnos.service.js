import axios from './root.service.js';

/**
 * Obtener todos los alumnos
 */
export async function getAlumnos() {
  try {
    const { data } = await axios.get('/alumnos/');
    return data.data;
  } catch (error) {
    console.error('Error al obtener los alumnos:', error);
    throw error;
  }
}

/**
 * Buscar un alumno por RUT
 */
export async function getAlumnoByRut(rut_alumno) {
  try {
    const { data } = await axios.get(`/alumnos/rut/${rut_alumno}`);
    return data.data;
  } catch (error) {
    console.error('Error al obtener el alumno por RUT:', error);
    throw error;
  }
}

/**
 * Obtener alumnos por curso
 */
export const getAlumnosByCurso = async (idCurso) => {
  try {
    const response = await axios.get(`/usuarios/alumnoscurso/${idCurso}`);
    // Accede a la propiedad 'data' dentro de la respuesta
    return response.data.data || []; // Asegúrate de devolver un array aunque esté vacío
  } catch (error) {
    console.error("Error al obtener los alumnos por curso:", error);
    throw error; // Lanza el error para manejarlo más arriba
  }
};


/**
 * Buscar alumnos por nombre (opcionalmente por curso)
 */
export async function getAlumnosByNombre(nombre, id_curso = null) {
  try {
    const params = { nombre };
    if (id_curso) params.id_curso = id_curso;

    const { data } = await axios.get('/alumnos/buscar', { params });
    return data.data;
  } catch (error) {
    console.error('Error al buscar alumnos por nombre:', error);
    throw error;
  }
}

/**
 * Crear un nuevo alumno
 */
export async function createAlumno(alumnoData) {
  try {
    const { data } = await axios.post('/alumnos/crear/', alumnoData);
    return data.data;
  } catch (error) {
    console.error('Error al crear el alumno:', error);
    throw error;
  }
}

/**
 * Actualizar un alumno
 */
export async function updateAlumno(rut_alumno, alumnoData) {
  try {
    const { data } = await axios.put(`/alumnos/actualizar/${rut_alumno}`, alumnoData);
    return data.data;
  } catch (error) {
    console.error('Error al actualizar el alumno:', error);
    throw error;
  }
}

/**
 * Eliminar un alumno
 */
export async function deleteAlumno(rut_alumno) {
  try {
    const { data } = await axios.delete(`/alumnos/borrar/${rut_alumno}`);
    return data.data;
  } catch (error) {
    console.error('Error al eliminar el alumno:', error);
    throw error;
  }
}
