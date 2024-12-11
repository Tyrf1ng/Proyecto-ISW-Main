import axios from "./root.service.js";

export const NotasCurso = async (idCurso) => {
    try {
      const response = await axios.get(`/notas/curso/${idCurso}`);
      return response.data; 
    } catch (error) {
      console.error('Error al obtener las notas del Curso', error);
      return error.response.data;
    }
  };

export const createNota = async (nota) => {
    try {
        const response = await axios.post('/notas/crear/', nota);
        return response;
    } catch (error) {
        return error.response;
    }
}
export const deleteNota = async (id) => {
    try {
        const response = await axios.delete(`/notas/borrar/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}
export const updateNota = async (id, data) => {
    try {
      
      const payload = {
        valor: parseFloat(data.valor), 
        tipo: data.tipo,              
      };
      const response = await axios.patch(`/notas/actualizar/${id}`, payload)
      return response.data; 
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      return { success: false, message: error.message };
    }
  };


export const getNotasPorRUT = async (rut) => {
    try {
        const response = await axios.get(`/notas/alumno/${rut}`);
        return response.data; // Devuelve las notas del alumno
    } catch (error) {
        console.error('Error al obtener las notas por RUT:', error);
        return error.response.data;
    }
};

export const getNotasPorAsignatura = async (rut,id_asignatura) => {
    try {
        const response = await axios.get(`/notas/asignatura/${id_asignatura}/alumno/${rut}`);
        return response.data; // Devuelve las notas del alumno
    } catch (error) {
        console.error('Error al obtener las notas por asignatura:', error);
        return error.response.data;
    }
}