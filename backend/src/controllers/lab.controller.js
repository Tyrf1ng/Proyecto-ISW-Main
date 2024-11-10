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

import Joi from "joi";

// Definición del esquema de validación
const labBodyValidation = Joi.object({
    nombre: Joi.string().max(255).required(),
    capacidad: Joi.number().integer().required(),
});

//Funciona NO TOCAR
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

//Funciona NO TOCAR
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

//Funciona NO TOCAR
export async function createLab(req, res) {
    try {
        console.log("Solicitud recibida para crear laboratorio:", req.body); // Agrega este log
        const { nombre, capacidad } = req.body;
        if (!nombre || !capacidad) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios");
        }

        const { error: bodyError } = labBodyValidation.validate({ nombre, capacidad });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [lab, errorLab] = await createLabService({ nombre, capacidad });
        if (errorLab) return handleErrorClient(res, 400, errorLab);

        handleSuccess(res, 201, "Laboratorio creado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

//Funciona NO TOCAR
export async function updateLab(req, res) {
    try {
        const { id_lab } = req.params;
        const { body } = req;
        const { error: bodyError } = labBodyValidation.validate(body);
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [lab, errorLab] = await updateLabService(id_lab, body);
        if (errorLab) return handleErrorClient(res, 404, errorLab);

        handleSuccess(res, 200, "Laboratorio actualizado", lab);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

//Funciona NO TOCAR
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