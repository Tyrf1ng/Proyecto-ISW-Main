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

export async function getCursosByProfesor(rut) {
    try {
        // Validación del usuario y rol directamente en el servicio
        const usuarioResponse = await axios.get(`/usuarios/${rut}`);
        const usuario = usuarioResponse.data.data;

        if (!usuario || usuario.id_roles !== 2) {
            throw new Error('El usuario no tiene el rol de profesor o no existe');
        }

        // Si es válido, obtenemos los cursos
        const response = await axios.get(`/cursos/profesor/${rut}`);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener cursos por profesor:', error);
        throw error.response?.data || { message: error.message };
    }
}
