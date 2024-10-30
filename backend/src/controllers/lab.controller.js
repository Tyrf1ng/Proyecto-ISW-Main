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

export async function getLab(req, res) {
    try {
        const { id, name } = req.query;
        const [lab, errorLab] = await getLabService({ id, name });
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
        labs.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Laboratorios encontrados", labs);
    }catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}

export async function createLab(req, res) {
    try {
        const { body } = req;
        const { error: bodyError } = labBodyValidation.validate(body);
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);
        const [lab, errorLab] = await createLabService(body);
        if (errorLab) return handleErrorClient(res, 400, errorLab);
        handleSuccess(res, 201, "Laboratorio creado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateLab(req, res) {
    try {
        const { id, name } = req.query;
        const { body } = req;
        const { error: queryError } = labQueryValidation.validate({ id, name });
        if (queryError) return handleErrorClient(res, 400, queryError.message);
        const { error: bodyError } = labBodyValidation.validate(body);
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);
        const [lab, errorLab] = await updateLabService({ id, name }, body);
        if (errorLab) return handleErrorClient(res, 404, errorLab);
        handleSuccess(res, 200, "Laboratorio actualizado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteLab(req, res) {
    try {
        const { id, name } = req.query;
        const { error } = labQueryValidation.validate({ id, name });
        if (error) return handleErrorClient(res, 400, error.message);
        const [lab, errorLab] = await deleteLabService({ id, name });
        if (errorLab) return handleErrorClient(res, 404, errorLab);
        handleSuccess(res, 200, "Laboratorio eliminado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}