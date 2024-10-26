"use strict";
import Joi from "joi";

export const cursoQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del curso debe ser un número.",
      "number.integer": "El id del curso debe ser un número entero.",
      "number.positive": "El id del curso debe ser un número positivo.",
    }),
  usuarioId: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id del usuario debe ser un número.",
      "number.integer": "El id del usuario debe ser un número entero.",
      "number.positive": "El id del usuario debe ser un número positivo.",
    }),
  nombre: Joi.string()
    .min(5)
    .max(255)
    .messages({
      "string.empty": "El nombre del curso no puede estar vacío.",
      "string.base": "El nombre del curso debe ser de tipo string.",
      "string.min": "El nombre del curso debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre del curso debe tener como máximo 255 caracteres.",
    }),
})
  .or("id", "usuarioId", "nombre")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id, usuarioId o nombre.",
  });

export const cursoBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(5)
    .max(255)
    .required()
    .messages({
      "string.empty": "El nombre del curso no puede estar vacío.",
      "string.base": "El nombre del curso debe ser de tipo string.",
      "string.min": "El nombre del curso debe tener como mínimo 5 caracteres.",
      "string.max": "El nombre del curso debe tener como máximo 255 caracteres.",
    }),
  año: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "El año del curso debe ser un número.",
      "number.integer": "El año del curso debe ser un número entero.",
      "number.min": "El año del curso debe ser mayor o igual a 1900.",
      "number.max": "El año del curso no puede ser mayor que el año actual.",
    }),
  usuarioId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id del usuario debe ser un número.",
      "number.integer": "El id del usuario debe ser un número entero.",
      "number.positive": "El id del usuario debe ser un número positivo.",
      "any.required": "El id del usuario es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
