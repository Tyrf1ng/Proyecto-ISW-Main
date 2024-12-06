import { getAsignaturasByProfesor, getNombreAsignaturaById } from "../services/asignatura.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Obtener asignaturas por RUT de un profesor
 */
export async function getAsignaturasByProfesorController(req, res) {
    try {
        const { rut } = req.params;
        const [asignaturas, errorAsignaturas] = await getAsignaturasByProfesor(rut);

        if (errorAsignaturas) return handleErrorClient(res, 404, errorAsignaturas);

        if (asignaturas.length === 0) {
            return handleSuccess(res, 204, "No hay asignaturas para este profesor");
        }
        handleSuccess(res, 200, "Asignaturas encontradas", asignaturas);

    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getNombreAsignaturaByIdController(req, res) {
    try {
        const { id_asignatura } = req.params;
        const [nombreAsignatura, errorNombreAsignatura] = await getNombreAsignaturaById(id_asignatura);

        if (errorNombreAsignatura) return handleErrorClient(res, 404, errorNombreAsignatura);

        handleSuccess(res, 200, "Nombre de asignatura encontrado", nombreAsignatura);
        
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}