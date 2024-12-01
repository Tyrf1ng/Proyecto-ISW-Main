import axios from "axios";

export async function getAsignaturasByProfesor(rut_docente) {
    try {
        const response = await axios.get(`/asignaturas/profesor/${rut_docente}`);
        console.log('getAsignaturasByProfesor:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener asignaturas por profesor:', error);
        throw error;
    }
}