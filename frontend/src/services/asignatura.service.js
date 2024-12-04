import axios from "axios";

export async function getAsignaturasByProfesor(rut) {
    try {
 
        const response = await axios.get(`/asignaturas/profesor/${rut}`);

        // Filtrar asignaturas para rol 2
        const asignaturas = response.data.data.filter((asignatura) => asignatura.rol === 2);

        console.log('getAsignaturasByProfesor (filtrado):', asignaturas);

        return asignaturas;
    } catch (error) {
        console.error('Error al obtener asignaturas por profesor:', error);
        throw error;
    }
}
