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
        const response = await axios.post('/reserva/create', reserva);
        return response.data;
    } catch (error) {
        console.error("Error al crear la reserva: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function updateReserva(id_reserva, reserva) {
    try {
        const response = await axios.patch(`/reserva/update/${id_reserva}`, reserva);
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

export async function getReservasByLab(id_lab) {
    try {
        const response = await axios.get(`/reserva/lab/${id_lab}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las reservas por laboratorio: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function getReservasByDocente(rut_docente) {
    try {
        const response = await axios.get(`/reserva/docente/${rut_docente}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las reservas por docente: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function getReservasByFecha(fecha) {
    try {
        const response = await axios.get(`/reserva/fecha/${fecha}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las reservas por fecha: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}