import axios from "./root.service.js";

export async function AllHorarios() {
    try {
        const response = await axios.get('/horarios/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los horarios: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function createHorario(horario) {
    try {
        const response = await axios.post('/horarios/create', horario);
        return response.data;
    } catch (error) {
        console.error("Error al crear el horario: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function updateHorario(horario) {
    try {
        const { id_horario, createdAt, updatedAt, ...data } = horario; // Excluir id_horario, createdAt y updatedAt del cuerpo de la solicitud
        const response = await axios.patch(`/horarios/update/${id_horario}`, data);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el horario: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function deleteHorario(id_horario) {
    try {
        const response = await axios.delete(`/horarios/delete/${id_horario}`);
        return response.data;
    } catch (error) {
        alert(error.response.data.message);
        return error.response ? error.response.data : { error: error.message };
    }
}