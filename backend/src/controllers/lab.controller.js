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
    capacidad: Joi.number().integer().min(1).max(99).required(), // Validación de capacidad
});

// Definición del esquema de validación para la actualización
const labUpdateValidation = Joi.object({
    id_lab: Joi.number().integer().required(),
    nombre: Joi.string().max(255).required(),
    capacidad: Joi.number().integer().min(1).max(99).required(), // Validación de capacidad
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

const normalizeName = (name) => {
    return name.replace(/\s+/g, ' ').trim();
};

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

        const normalizedNombre = normalizeName(nombre);
        const { error: bodyError } = labBodyValidation.validate({ nombre: normalizedNombre, capacidad });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [lab, errorLab] = await createLabService({ nombre: normalizedNombre, capacidad });
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
        const normalizedNombre = normalizeName(body.nombre);
        const { error: bodyError } = labUpdateValidation.validate({ id_lab, ...body, nombre: normalizedNombre });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [lab, errorLab] = await updateLabService(id_lab, { ...body, nombre: normalizedNombre });
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