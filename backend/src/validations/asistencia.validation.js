"use strict";
import Joi from "joi";

export const asistenciaQueryValidation = Joi.object({
    id_asignatura: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El id de la asignatura debe ser un número.",
            "number.integer": "El id de la asignatura debe ser un número entero.",
            "number.positive": "El id de la asignatura debe ser un número positivo.",
            "number.empty": "El id de la asignatura no puede estar vacío."
        }),
    
    rut: Joi.string()
        .required()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK0-9]$/)
        .messages({
            "string.empty":"El rut no debe estar vacio",
            "string.base":"El rut debe ser un string",
            "string.min":"El rut debe tener al menos 9 caracteres",
            "string.max":"El rut debe tener como maximo 12 caracteres",
            "string.pattern.base":"El rut debe tener un formato valido: xx.xxx.xxx-x o xxxxxxxx-x"
        }),

    tipo: Joi.string()
        .required()
        .valid(["Presente", "Ausente", "Justificado"])
        .insensitive()
        .messages({
            "any.only": "El tipo de asistencia debe ser 'Presente', 'Ausente' o 'Justificado'.",
            "string.empty": "El tipo de asistencia no debe estar vacío.",
            "string.base": "El tipo de asistencia debe ser un string."
        })

})
