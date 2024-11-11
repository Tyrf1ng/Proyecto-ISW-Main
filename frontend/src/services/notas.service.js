import axios from "./root.service.js";



export const AllNotas = async () => {
    try {
        const response = await axios.get('/notas/');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const NotasCurso = async (id_curso) => {
    try {
      const response = await axios.get(`/api/notas/curso/${id_curso}`);
      return response.data; // Devuelve las notas del curso
    } catch (error) {
      console.error('Error al obtener las notas de la asignatura', error);
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