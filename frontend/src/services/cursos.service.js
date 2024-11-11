import axios from './root.service.js';
import { formatCourseData } from '@helpers/formatData.js';

export async function getCursos() {
    try {
        const { data } = await axios.get('/cursos/');
        const formattedData = data.data.map(formatCourseData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}
export async function getCurso(id_curso) {
    try {
        const { data } = await axios.get(`/cursos/${id_curso}`);
        return data.data;
    } catch (error) {
        return error.response.data;
    }
}   
