"use strict";
import { 
    createLabService,
    deleteLabService, 
    getLabService, 
    getLabsService,
    updateLabService,
} from "../services/lab.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

import { labBodyValidation} from "../validations/lab.validation.js";

const normalizeName = (name) => {
    return name.replace(/\s+/g, ' ').trim();
};

export async function getLab(req, res) {
    try {
        const { id_lab } = req.params; 
        const [lab, errorLab] = await getLabService(id_lab);
        if (errorLab) return handleErrorClient(res, 404, errorLab);
        handleSuccess(res, 200, "Laboratorio encontrado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getLabs(req, res) {
    try {
        const [labs, errorLabs] = await getLabsService();
        if (errorLabs) return handleErrorClient(res, 404, errorLabs);
        if (labs.length === 0) return handleSuccess(res, 204, "No hay laboratorios");
        handleSuccess(res, 200, "Laboratorios encontrados", labs);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createLab(req, res) {
    try {
        const { nombre, capacidad } = req.body;
        if (!nombre || !capacidad) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios");
        }

        const normalizedNombre = normalizeName(nombre);
        const { error: bodyError } = await labBodyValidation.validateAsync({ nombre: normalizedNombre, capacidad });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [lab, errorLab] = await createLabService({ nombre: normalizedNombre, capacidad });
        if (errorLab) return handleErrorClient(res, 400, errorLab);

        handleSuccess(res, 201, "Laboratorio creado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateLab(req, res) {
    try {
        const { id_lab } = req.params;
        const { body } = req;
        const normalizedNombre = normalizeName(body.nombre);
        const { error: bodyError } = await labBodyValidation.validateAsync({ id_lab, ...body, nombre: normalizedNombre });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [lab, errorLab] = await updateLabService(id_lab, { ...body, nombre: normalizedNombre });
        if (errorLab) return handleErrorClient(res, 404, errorLab);

        handleSuccess(res, 200, "Laboratorio actualizado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteLab(req, res) {
    try {
        const { id_lab } = req.params;
        const [lab, errorLab] = await deleteLabService(id_lab);
        if (errorLab) return handleErrorClient(res, 404, errorLab);
        handleSuccess(res, 200, "Laboratorio eliminado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}