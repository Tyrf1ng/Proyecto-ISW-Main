import axios from "./root.service.js";



export const AllNotas = async () => {
    try {
        const response = await axios.get('/notas/');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const NotasAsignatura = async (id_asignatura) => {
    try {
        const response = await axios.get(`/notas/asignatura/${id_asignatura}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const createNota = async (nota) => {
    try {
        const response = await axios.post('/notas/crear/', nota);
        return response;
    } catch (error) {
        return error.response;
    }
}