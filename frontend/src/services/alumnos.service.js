import axios from './root.service.js';


export async function getAlumnos() {
  try {
    const { data } = await axios.get('/alumnos/');
    return data.data;
  } catch (error) {
    console.error('Error al obtener los alumnos:', error);
    throw error;
  }
}


export const getAlumnosByCurso = async (idCurso) => {
  try {
    const response = await axios.get(`/usuarios/alumnoscurso/${idCurso}`);
  
    return response.data.data || []; 
  } catch (error) {
    console.error("Error al obtener los alumnos por curso:", error);
    throw error; 
  }
};


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
