"use strict";
import {
    createEncargadoLabService,
    deleteEncargadoLabService,
    getEncargadoLabByRutService,
    getEncargadosLabService,
    updateEncargadoLabService,
} from "../services/encargado_lab.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getEncargadosLab(req, res) {
    try {
        const [encargados, error] = await getEncargadosLabService();
        if (error) return handleErrorClient(res, 404, error);
        encargados.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Encargados encontrados", encargados);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getEncargadoLabByRut(req, res) {
    try {
        const { rut_encargado } = req.params;
        const [encargado, error] = await getEncargadoLabByRutService(rut_encargado);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Encargado encontrado", encargado);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createEncargadoLab(req, res) {
    try {
        const [encargado, error] = await createEncargadoLabService(req.body);
        if (error) return handleErrorClient(res, 400, error);
        handleSuccess(res, 201, "Encargado creado", encargado);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateEncargadoLab(req, res) {
    try {
        const { rut_encargado } = req.params;
        const [encargado, error] = await updateEncargadoLabService(rut_encargado, req.body);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Encargado actualizado", encargado);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteEncargadoLab(req, res) {
    try {
        const { rut_encargado } = req.params;
        const [encargado, error] = await deleteEncargadoLabService(rut_encargado);
        if (error) return handleErrorClient(res, 404, error);
        handleSuccess(res, 200, "Encargado eliminado", encargado);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
