import axios from "./root.service.js";

//Funcion para crear una nota
export const createNota = async (nota) => {
    try {
        const response = await axios.post('/notas/crear/', nota);
        return response;
    } catch (error) {
        return error.response;
    }
}

//Funcion para borrar nota
export const deleteNota = async (id) => {
    try {
        const response = await axios.delete(`/notas/borrar/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

//Funcion para editar algun dato de la nota
export const updateNota = async (id, data) => {
    try {
      const payload = {
        valor: parseFloat(data.valor), 
        tipo: data.tipo,               
      };
  
      const response = await axios.patch(`/notas/actualizar/${id}`, payload);
      return response.data; 
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      return { success: false, message: error.message };
    }
  };

//Funcion para traer Notas en base a la asignatura 
// VISTA ALUMNO
export const getNotasPorAsignatura = async (rut,idAsignatura) => {
    try {
        const response = await axios.get(`/notas/asignatura/${idAsignatura}/alumno/${rut}`);
        return response.data; 
    } catch (error) {
        console.error('Error al obtener las notas por asignatura:', error);
        return error.response.data;
    }
}

//Funcion para traer Notas en base a la asignatura 
// VISTA PROFESOR
export const getNotasPorCursoYAsignatura = async (idCurso, idAsignatura) => {
    try {
        const response = await axios.get(`/notas/curso/${idCurso}/asignatura/${idAsignatura}`);
        return response.data.data; 
    } catch (error) {
        console.error('Error al obtener las notas por curso y asignatura:', error);
        throw new Error('No se pudieron cargar las Notas');
    }
}