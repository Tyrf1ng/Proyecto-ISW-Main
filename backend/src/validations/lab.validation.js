"use strict";
import Joi from "joi";
import { getLabsService } from "../services/lab.service.js";

const normalizeName = (name) => {
    return name.replace(/\s+/g, ' ').trim();
};

export const labBodyValidation = Joi.object({
    nombre: Joi.string().max(255).required().custom(async (value, helpers) => {
        const normalizedNombre = normalizeName(value);
        const [labs, errorLabs] = await getLabsService();
        if (errorLabs) return helpers.message("Error al validar el nombre del laboratorio");
        if (labs.some(lab => normalizeName(lab.nombre).toLowerCase() === normalizedNombre.toLowerCase())) {
            return helpers.message("El nombre del laboratorio ya existe");
        }
        return value;
    }),
    capacidad: Joi.number().integer().min(1).max(99).required().messages({
        "number.base": "Capacidad debe ser un número entero",
        "number.min": "Capacidad debe ser mayor a 0",
        "number.max": "Capacidad debe ser menor a 100",
    }),
});

export const labUpdateValidation = Joi.object({
    id_lab: Joi.number().integer().required(),
    nombre: Joi.string().max(255).required().custom(async (value, helpers) => {
        const normalizedNombre = normalizeName(value);
        const [labs, errorLabs] = await getLabsService();
        if (errorLabs) return helpers.message("Error al validar el nombre del laboratorio");
        if (labs.some(lab => normalizeName(lab.nombre).toLowerCase() === normalizedNombre.toLowerCase())) {
            return helpers.message("El nombre del laboratorio ya existe");
        }
        return value;
    }),
    capacidad: Joi.number().integer().min(1).max(99).required().messages({
        "number.base": "Capacidad debe ser un número entero",
        "number.min": "Capacidad debe ser mayor a 0",
        "number.max": "Capacidad debe ser menor a 100",
    }),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});