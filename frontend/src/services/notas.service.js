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
      const response = await axios.get(`/notas/curso/${id_curso}`);
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
export const updateNota = async (id, valor, tipo) => {
    try {
        const data = { valor: parseFloat(valor) };
        if (tipo) {
            data.tipo = tipo;
        }
        const response = await axios.patch(`/notas/actualizar/${id}`, data);
        return response.data; 
    } catch (error) {
        console.error("Error al actualizar la nota:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Error al actualizar la nota",
            status: error.response?.status || 500,
        };
    }
};


export const getNotasPorRUT = async (rutsAlumnos) => {
    try {
        const response = await axios.get(`/notas/alumno/${rutsAlumnos}`);
        return response.data; // Devuelve las notas del alumno
    } catch (error) {
        console.error('Error al obtener las notas por RUT:', error);
        return error.response.data;
    }
};
