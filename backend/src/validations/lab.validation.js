"use strict";
import Joi from "joi";
import { getLabsService } from "../services/lab.service.js";

const normalizeName = (name) => {
    return name.replace(/\s+/g, ' ').trim();
};

export const labBodyValidation = Joi.object({
    nombre: Joi.string()
    .max(255)
    .required()
    .custom(async (value, helpers) => {
        const normalizedNombre = normalizeName(value);
        const [labs, errorLabs] = await getLabsService();
        if (errorLabs) return helpers.message("Error al validar el nombre del laboratorio");
        if (labs.some(lab => normalizeName(lab.nombre).toLowerCase() === normalizedNombre.toLowerCase())) {
            return helpers.message("El nombre del laboratorio ya existe");
        }
        return value;
    }),
    capacidad: Joi.number()
    .integer()
    .min(5)
    .max(99)
    .required()
    .messages({
        "number.base": "Capacidad debe ser un número entero",
        "number.min": "Capacidad debe ser mayor a 4",
        "number.max": "Capacidad debe ser menor a 100",
    }),
    id_lab: Joi.number()
    .integer()
    .positive()
    .messages({
        "number.base": "El id del laboratorio debe ser un número.",
        "number.integer": "El id del laboratorio debe ser un número entero.",
        "number.positive": "El id del laboratorio debe ser un número positivo.",
        "number.empty": "El id del laboratorio no puede estar vacío."
    }),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});
