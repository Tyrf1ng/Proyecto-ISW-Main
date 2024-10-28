"use strict";
import {     createAnotacionService,
    getAnotacionesService, 
    getAnotacionService, 
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