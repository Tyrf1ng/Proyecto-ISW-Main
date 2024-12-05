import axios from "./root.service.js";

export async function getAllReservas() {
    try {
        const response = await axios.get('/reserva/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las reservas: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function getReserva(id_reserva) {
    try {
        const response = await axios.get(`/reserva/${id_reserva}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la reserva: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function createReserva(reserva) {
    try {
        const response = await axios.post('/reserva/create', {
            id_lab: reserva.id_lab,
            rut: reserva.rut,
            fecha: reserva.fecha,
            id_horario: reserva.id_horario,
            id_asignatura: reserva.id_asignatura,
            id_curso: reserva.id_curso,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la reserva: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function updateReserva(id_reserva, reserva) {
    try {
        const response = await axios.patch(`/reserva/update/${id_reserva}`, {
            id_lab: reserva.id_lab,
            rut: reserva.rut,
            fecha: reserva.fecha,
            id_horario: reserva.id_horario,
            id_asignatura: reserva.id_asignatura,
            id_curso: reserva.id_curso,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la reserva: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function deleteReserva(id_reserva) {
    try {
        const response = await axios.delete(`/reserva/delete/${id_reserva}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la reserva: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}


export async function getReservasByUsuario(rut) {
    try {
        const response = await axios.get(`/reserva/usuario/${rut}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las reservas por usuario: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}
