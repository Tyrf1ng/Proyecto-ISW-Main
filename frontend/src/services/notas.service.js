import axios from "./root.service.js";



export const AllNotas = async () => {
    try {
        const response = await axios.get('/notas/');
        return response;
    } catch (error) {
        return error.response;
    }
}