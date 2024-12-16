"use strict";
import {
    createAnotacionService,
    deleteAnotacionService,
    getAnotacionesPorCursoYAsignaturaService,
    getAnotacionesAlumnoService,
    getAnotacionesPorRutYAsignaturaService,
    getAnotacionesAsignaturaService,
    getAnotacionesCursoService,
    getAnotacionesService,
    getAnotacionService,
    updateAnotacionService
} from "../services/anotaciones.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { anotacionCreateQueryValidation, anotacionEditQueryValidation } from "../validations/anotaciones.validation.js";

export async function getAnotacion(req, res) {
    const { id_anotacion } = req.params;
    const [anotacion, error] = await getAnotacionService(id_anotacion);
    if (error) {
        return res.status(404).json({ status: "Client error", message: error });
    }
    return res.json(anotacion);
}

export async function getAnotaciones(req, res) {
    try {
        const [anotaciones, errorAnotaciones] = await getAnotacionesService();
        if (errorAnotaciones) return handleErrorClient(res, 404, errorAnotaciones);
        anotaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAnotacionesAsignatura(req, res) {
    try {
        const { id_asignatura } = req.params;
        const [anotaciones, errorAnotaciones] = await getAnotacionesAsignaturaService(id_asignatura);
        if (errorAnotaciones) return handleErrorClient(res, 404, errorAnotaciones);
        anotaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAnotacionesAlumno(req, res) {
    try {
        const { rut } = req.params;
        const [anotaciones, errorAnotaciones] = await getAnotacionesAlumnoService(rut);
        if (errorAnotaciones) return handleErrorClient(res, 404, errorAnotaciones);
        anotaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAnotacionesCurso(req, res) {
    try {
        const { id_curso } = req.params;
        const [anotaciones, errorAnotaciones] = await getAnotacionesCursoService(id_curso);
        if (errorAnotaciones) return handleErrorClient(res, 404, errorAnotaciones);
        anotaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createAnotacion(req, res) {
    try {
        const { descripcion, tipo, id_asignatura, rut } = req.body;
        const { error } = anotacionCreateQueryValidation.validate({ descripcion, tipo, id_asignatura, rut });
        if (error) {
            return handleErrorClient(res, 400, "Datos inválidos en el cuerpo de la solicitud", error.message);
        }
        const [anotacion, errorAnotacion] = await createAnotacionService({
            descripcion,
            tipo,
            id_asignatura,
            rut,
        });
        if (errorAnotacion) return handleErrorClient(res, 404, errorAnotacion);
        handleSuccess(res, 201, "Anotacion creada", anotacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateAnotacion(req, res) {
    try {
        const { id_anotacion } = req.params;
        const { descripcion, tipo } = req.body;
        const { error } = anotacionEditQueryValidation.validate({
            id_anotacion,
            descripcion,
            tipo,
        });
        if (error) {
            return handleErrorClient(res, 400, "Datos inválidos para actualizar la anotación", error.message);
        }
        const datosActualizados = {
            descripcion,
            tipo,
        };
        const [anotacion, errorAnotacion] = await updateAnotacionService(
            parseInt(id_anotacion, 10),
            datosActualizados
        );
        if (errorAnotacion) return handleErrorClient(res, 404, errorAnotacion);
        handleSuccess(res, 200, "Anotacion actualizada", anotacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteAnotacion(req, res) {
    try {
        const { id_anotacion } = req.params;
        const [anotacion, errorAnotacion] = await deleteAnotacionService(id_anotacion);
        if (errorAnotacion) return handleErrorClient(res, 404, errorAnotacion);
        handleSuccess(res, 200, "Anotacion eliminada", anotacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAnotacionesPorCursoYAsignatura(req, res) {
    try {
        const { id_curso, id_asignatura } = req.params;
        if (!id_curso || !id_asignatura) {
            return handleErrorClient(
                res,
                400,
                "Los parámetros 'id_curso' e 'id_asignatura' son obligatorios"
            );
        }
        const [anotaciones, error] = await getAnotacionesPorCursoYAsignaturaService(id_curso, id_asignatura);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    } catch (error) {
        console.error("Error en el controller de obtener anotaciones por curso y asignatura:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAnotacionesPorRutYAsignatura(req, res) {
    try {
        const { rut, id_asignatura } = req.params;
        if (!rut || !id_asignatura) {
            return handleErrorClient(res, 400, "Los parámetros 'rut' e 'id_asignatura' son obligatorios");
        }
        const idAsignatura = parseInt(id_asignatura, 10);
        if (isNaN(idAsignatura)) {
            return handleErrorClient(res, 400, "'id_asignatura' debe ser un número válido");
        }
        const [anotaciones, error] = await getAnotacionesPorRutYAsignaturaService(rut, idAsignatura);
        if (error) {
            return handleErrorClient(res, 404, error);
        }
        handleSuccess(res, 200, anotaciones.length === 0 ? "No hay anotaciones disponibles" : "Anotaciones encontradas", anotaciones);
    } catch (error) {
        console.error("Error en el controlador de obtener anotaciones por RUT y asignatura:", error);
        handleErrorServer(res, 500, "Error interno del servidor");
    }
}
