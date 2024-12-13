import { 
    getAsignaturasByAlumno, 
    getAsignaturasByProfesor, 
    getNombreAsignaturaById,
    createAsignatura
} from "../services/asignatura.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

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

export async function getAsignaturasByAlumnoController(req, res) {
    try {
        const { rut } = req.params;
        const [asignaturas, errorAsignaturas] = await getAsignaturasByAlumno(rut);
        if (errorAsignaturas) return handleErrorClient(res, 404, errorAsignaturas);
        if (asignaturas.length === 0) {
            return handleSuccess(res, 204, "No hay asignaturas para este alumno");
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

// Nuevo controlador para crear asignatura
export async function createAsignaturaController(req, res) {
    try {
        const { rut_docente, nombre } = req.body;
        if (!rut_docente || !nombre) {
            return handleErrorClient(res, 400, "rut_docente y nombre son requeridos");
        }

        const [asignatura, errorAsignatura] = await createAsignatura(rut_docente, nombre);
        if (errorAsignatura) return handleErrorClient(res, 400, errorAsignatura);

        handleSuccess(res, 201, "Asignatura creada", asignatura);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
