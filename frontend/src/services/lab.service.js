import axios from "./root.service.js";

export async function AllLabs() { 
    try {
        const response = await axios.get('/labs/');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function Lab(id_lab) {
    try {
        const response = await axios.get(`/labs/${id_lab}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export async function createLab(lab) {
    try {
        const response = await axios.post('/labs/create', lab);
        return response;
    } catch (error) {
        return error.response;
    }
}

export async function updateLab(lab) {
    try {
        const response = await axios.put(`/labs/${lab.id_lab}`, lab);
        return response;
    } catch (error) {
        return error.response;
    }
}

export async function deleteLab(id_lab) {
    try {
        const response = await axios.delete(`/labs/${id_lab}`);
        return response;
    } catch (error) {
        return error.response;
    }
}