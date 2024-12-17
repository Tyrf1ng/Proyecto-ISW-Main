"use strict";
import Joi from "joi";

export const cursoCreateValidation = Joi.object({

  nombre: Joi.string()
    .min(5)
    .max(30)
    .messages({
      "string.empty": "El nombre del curso no puede estar vacío.",
      "string.base": "El nombre del curso debe ser de tipo string.",
      "string.min": "El nombre del curso debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre del curso debe tener como máximo 255 caracteres.",
    }),
  nivel: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El nivel del curso debe ser un número.",
      "number.integer": "El nivel del curso debe ser un número entero.",
      "number.positive": "El nivel del curso debe ser un número positivo.",
    }),
    año: Joi.date()
    .required()
    .messages({
      "number.base": "El año del curso debe ser un número.",
      "any.required": "El año del curso es obligatorio.",
    }),
  });

export const cursoEditValidation = Joi.object({
  nombre: Joi.string()
    .min(5)
    .max(255)
    .optional()
    .messages({
      "string.base": "El nombre del curso debe ser de tipo string.",
      "string.min": "El nombre del curso debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre del curso debe tener como máximo 255 caracteres.",
    }),
  año: Joi.date()
    .min(new Date(new Date().getFullYear(), 0, 1)) 
    .max(new Date(new Date().getFullYear() + 1, 11, 31)) 
    .optional()
    .messages({
      "date.base": "El año del curso debe ser una fecha.",
      "date.min": `El año del curso no puede ser anterior al ${new Date().getFullYear()}.`,
      "date.max": `El año del curso no puede ser posterior al ${new Date().getFullYear() + 1}.`,
    }),
  nivel: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El nivel del curso debe ser un número.",
      "number.integer": "El nivel del curso debe ser un número entero.",
      "number.positive": "El nivel del curso debe ser un número positivo.",
    }),
})
