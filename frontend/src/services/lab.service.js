import axios from "./root.service.js";

export async function AllLabs() { 
    try {
        const response = await axios.get('/labs/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los laboratorios: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function createLab(lab) {
    try {
        const response = await axios.post('/labs/create', lab);
        return response.data;
    } catch (error) {
        console.error("Error al crear el laboratorio: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function updateLab(lab) {
    try {
        const response = await axios.patch(`/labs/update/${lab.id_lab}`, lab);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el laboratorio: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}

export async function deleteLab(id_lab) {
    try {
        const response = await axios.delete(`/labs/delete/${id_lab}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el laboratorio: ", error.response ? error.response.data : error.message);
        return error.response ? error.response.data : { error: error.message };
    }
}