"use strict";
import { 
    createDocenteService,
    deleteDocenteService,
    getDocenteByRutService,
    getDocentesByNombreService,
    getDocentesService,
    updateDocenteService
} from "../services/docente.service.js"; // Importa los servicios específicos para docentes
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Obtener todos los docentes
 */
export async function getDocentes(req, res) {
    try {
        const [docentes, errorDocentes] = await getDocentesService();
        if (errorDocentes) return handleErrorClient(res, 404, errorDocentes);
        docentes.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Docentes encontrados", docentes);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Buscar un docente por RUT
 */
export async function getDocenteByRut(req, res) {
    try {
        const { rut_docente } = req.params;
        const [docente, errorDocente] = await getDocenteByRutService(rut_docente);
        if (errorDocente) return handleErrorClient(res, 404, errorDocente);
        handleSuccess(res, 200, "Docente encontrado", docente);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



/**
 * Buscar docentes por nombre
 */
export async function getDocentesByNombre(req, res) {
    try {
        const { nombre } = req.query; // Se toma el nombre desde los query params
        const { departamento } = req.query; // Opcional, para filtrar por departamento
        const [docentes, errorDocentes] = await getDocentesByNombreService(nombre, departamento);
        if (errorDocentes) return handleErrorClient(res, 404, errorDocentes);
        docentes.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Docentes encontrados", docentes);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Crear un nuevo docente
 */
export async function createDocente(req, res) {
    try {
        const { nombre, rut_docente, email, telefono, departamento } = req.body;
        const [docente, errorDocente] = await createDocenteService({ 
            nombre, rut_docente, email, telefono, departamento });
        if (errorDocente) return handleErrorClient(res, 404, errorDocente);
        handleSuccess(res, 201, "Docente creado", docente);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Actualizar información de un docente
 */
export async function updateDocente(req, res) {
    try {
        const { rut_docente } = req.params;
        const { nombre, email, telefono, departamento } = req.body;

        const datosActualizados = { nombre, email, telefono, departamento };
        const [docente, errorDocente] = await updateDocenteService(rut_docente, datosActualizados);
        if (errorDocente) return handleErrorClient(res, 404, errorDocente);
        handleSuccess(res, 200, "Docente actualizado", docente);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Eliminar un docente
 */
export async function deleteDocente(req, res) {
    try {
        const { rut_docente } = req.params;
        const [docente, errorDocente] = await deleteDocenteService(rut_docente);
        if (errorDocente) return handleErrorClient(res, 404, errorDocente);
        handleSuccess(res, 200, "Docente eliminado", docente);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
