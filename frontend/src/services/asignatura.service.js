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