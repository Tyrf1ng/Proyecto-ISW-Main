"use stict";
import { getAsignaturasByProfesor } from "../services/asignatura.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getAsignaturasByProfesorController(req, res) {
    try {
        const { rut_docente } = req.params;
        const [asignaturas, errorAsignaturas] = await getAsignaturasByProfesor(rut_docente);
        if (errorAsignaturas) return handleErrorClient(res, 404, errorAsignaturas);
        asignaturas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asignaturas encontradas", asignaturas);
    } catch (error) {
        handleErrorServer(res, 500, error.message); }
    }