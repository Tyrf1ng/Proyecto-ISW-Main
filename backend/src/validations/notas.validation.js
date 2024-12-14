"use strict";
import Joi from "joi";

// Validación para crear una nota
export const notasCreateValidation = Joi.object({
  id_asignatura: Joi.number()
    .required()
    .messages({
      "number.empty": "El id de la asignatura no puede estar vacío.",
    }),
  rut: Joi.string()
    .required()
    .messages({
      "string.empty": "El rut del alumno no puede estar vacío.",
    }),
  valor: Joi.number()
    .min(2.0)
    .max(7.0)
    .required()
    .messages({
      "number.base": "El valor de la nota debe ser un número.",
      "number.min": "El valor de la nota debe ser mayor o igual a 2.0.",
      "number.max": "El valor de la nota debe ser menor o igual a 7.0.",
      "number.empty": "El valor de la nota no puede estar vacío.",
    }),
  tipo: Joi.string()
    .valid("Prueba", "Tarea", "Presentacion", "Test")
    .required()
    .messages({
      "string.base": "El tipo de nota debe ser Prueba/Tarea/Test/Presentacion.",
      "string.empty": "El tipo de nota no puede estar vacío.",
    }),
});

// Validación para editar una nota
export const notasEditValidation = Joi.object({
  id_nota: Joi.number()
    .required()
    .messages({
      "number.empty": "El id de la nota no puede estar vacío.",
    }),
  valor: Joi.number()
    .min(2.0)
    .max(7.0)
    .optional()
    .messages({
      "number.base": "El valor de la nota debe ser un número.",
      "number.min": "El valor de la nota debe ser mayor o igual a 2.0.",
      "number.max": "El valor de la nota debe ser menor o igual a 7.0.",
    }),
  tipo: Joi.string()
    .valid("Prueba", "Tarea", "Presentacion", "Test")
    .optional()
    .messages({
      "string.base": "El tipo de nota debe ser Prueba/Tarea/Test/Presentacion.",
    }),
});
