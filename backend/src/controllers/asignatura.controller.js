import { getAsignaturasByProfesor } from "../services/asignatura.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Obtener asignaturas por RUT de un profesor
 */
export async function getAsignaturasByProfesorController(req, res) {
    try {
        const { rut } = req.params; // Asegúrate de que el parámetro en la ruta sea `rut`

        // Llamamos al servicio para obtener las asignaturas del profesor
        const [asignaturas, errorAsignaturas] = await getAsignaturasByProfesor(rut);

        // Manejo de errores del servicio
        if (errorAsignaturas) return handleErrorClient(res, 404, errorAsignaturas);

        // Si no hay asignaturas, respondemos con un código 204
        if (asignaturas.length === 0) {
            return handleSuccess(res, 204, "No hay asignaturas para este profesor");
        }

        // Si se encontraron asignaturas, las devolvemos con un código 200
        handleSuccess(res, 200, "Asignaturas encontradas", asignaturas);
    } catch (error) {
        // Manejamos errores no controlados
        handleErrorServer(res, 500, error.message);
    }
}
