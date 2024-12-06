"use strict";
import Joi from "joi";
import { isHorarioValid } from "../services/horarios.service.js";

export const horarioBodyValidation = Joi.object({
    hora_inicio: Joi.string().required().custom((value, helpers) => {
        if (value < "08:00" || value > "22:00") {
            return helpers.message("La hora de inicio debe estar entre las 08:00 y las 22:00");
        }
        return value;
    }),
    hora_fin: Joi.string().required().custom((value, helpers) => {
        if (value < "08:00" || value > "22:00") {
            return helpers.message("La hora de fin debe estar entre las 08:00 y las 22:00");
        }
        return value;
    }),
    id_horario: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
        "number.base": "El id del horario debe ser un número.",
        "number.integer": "El id del horario debe ser un número entero.",
        "number.positive": "El id del horario debe ser un número positivo.",
        "number.empty": "El id del horario no puede estar vacío."
    }),
    hora_inicio : Joi.string()
    .required()
    .messages({
        "string.base": "La hora de inicio debe ser una cadena de texto",
        "string.empty": "La hora de inicio no puede estar vacía",
    }),
    hora_fin : Joi.string()
    .required()
    .messages({
        "string.base": "La hora de fin debe ser una cadena de texto",
        "string.empty": "La hora de fin no puede estar vacía",
    }),
}).custom(async (value, helpers) => {
    if (value.hora_inicio >= value.hora_fin) {
        return helpers.message("La hora de inicio debe ser menor que la hora de fin");
    }
    const isValid = await isHorarioValid(value.hora_inicio, value.hora_fin, value.id_horario);
    if (!isValid) {
        return helpers.message("El horario se solapa con otro existente o tiene horas de inicio/fin duplicadas");
    }
    return value;
});