"use strict";
import { createAnotacionService,
    deleteAnotacionService,
    getAnotacionesAlumnoService,
    getAnotacionesAsignaturaService,
    getAnotacionesCursoService,
    getAnotacionesService, 
    getAnotacionService,
    updateAnotacionService
     } from "../services/anotaciones.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";



export async function getAnotacion(req, res) {
    try {
        const { id_anotacion, descripcion, createdAt, tipo, id_asignatura, rut_alumnos } = req.query;
        const [anotacion, errorAnotacion] = await getAnotacionService
        ({ id_anotacion, descripcion, createdAt, tipo, id_asignatura, rut_alumnos });
        if (errorAnotacion) return handleErrorClient(res, 404, errorAnotacion);
        handleSuccess(res, 200, "Anotacion encontrada", anotacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getAnotaciones(req, res) {
    try {
        const [anotaciones, errorAnotaciones] = await getAnotacionesService();
        if (errorAnotaciones) return handleErrorClient(res, 404, errorAnotaciones);
        anotaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    }catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
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
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}

export async function getAnotacionesAlumno(req, res) {
    try {
        const { rut_alumno } = req.params;
        const [anotaciones, errorAnotaciones] = await getAnotacionesAlumnoService(rut_alumno);
        if (errorAnotaciones) return handleErrorClient(res, 404, errorAnotaciones);
        anotaciones.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Anotaciones encontradas", anotaciones);
    } catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
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
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}

export async function createAnotacion(req, res) {
    try {
        const { descripcion, tipo, id_asignatura, rut_alumno } = req.body;
        const [anotacion, errorAnotacion] = await createAnotacionService(
            { descripcion, tipo, id_asignatura, rut_alumno });
        if (errorAnotacion) return handleErrorClient(res, 404, errorAnotacion);
        handleSuccess(res, 201, "Anotacion creada", anotacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


export async function updateAnotacion(req, res) {
    try {
        const { id_anotacion } = req.params; 
        const { descripcion, tipo, id_asignatura, rut_alumno } = req.body;

        const datosActualizados = {
            descripcion,
            tipo,
            id_asignatura: id_asignatura ? parseInt(id_asignatura, 10) : null,
            rut_alumno,
        };

        const [anotacion, errorAnotacion] = await updateAnotacionService(parseInt(id_anotacion, 10), datosActualizados);
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
    }catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}