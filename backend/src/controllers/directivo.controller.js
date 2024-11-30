"use strict";
import { 
    createDirectivoService,
    deleteDirectivoService,
    getDirectivoByRutService,
    getDirectivosService,
    updateDirectivoService
} from "../services/directivo.service.js"; 
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Obtener todos los directivos
 */
export async function getDirectivos(req, res) {
    try {
        const [directivos, errorDirectivos] = await getDirectivosService();
        if (errorDirectivos) return handleErrorClient(res, 404, errorDirectivos);
        directivos.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Directivos encontrados", directivos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Buscar un directivo por RUT
 */
export async function getDirectivoByRut(req, res) {
    try {
        const { rut_directivo } = req.params;
        const [directivo, errorDirectivo] = await getDirectivoByRutService(rut_directivo);
        if (errorDirectivo) return handleErrorClient(res, 404, errorDirectivo);
        handleSuccess(res, 200, "Directivo encontrado", directivo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Crear un nuevo directivo
 */
export async function createDirectivo(req, res) {
    try {
        const { nombre, rut_directivo, email, telefono, cargo } = req.body;
        const [directivo, errorDirectivo] = await createDirectivoService({ 
            nombre, rut_directivo, email, telefono, cargo });
        if (errorDirectivo) return handleErrorClient(res, 404, errorDirectivo);
        handleSuccess(res, 201, "Directivo creado", directivo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Actualizar información de un directivo
 */
export async function updateDirectivo(req, res) {
    try {
        const { rut_directivo } = req.params;
        const { nombre, email, telefono, cargo } = req.body;

        const datosActualizados = { nombre, email, telefono, cargo };
        const [directivo, errorDirectivo] = await updateDirectivoService(rut_directivo, datosActualizados);
        if (errorDirectivo) return handleErrorClient(res, 404, errorDirectivo);
        handleSuccess(res, 200, "Directivo actualizado", directivo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Eliminar un directivo
 */
export async function deleteDirectivo(req, res) {
    try {
        const { rut_directivo } = req.params;
        const [directivo, errorDirectivo] = await deleteDirectivoService(rut_directivo);
        if (errorDirectivo) return handleErrorClient(res, 404, errorDirectivo);
        handleSuccess(res, 200, "Directivo eliminado", directivo);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
