import Joi from "joi";

export const anotacionQueryValidation = Joi.object({
  id_anotacion: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la anotación debe ser un número.",
      "number.integer": "El id de la anotación debe ser un número entero.",
      "number.positive": "El id de la anotación debe ser un número positivo.",
    }),
    descripcion: Joi.string()
    .min(5)
    .max(1024) // Limitar la descripción a un máximo de 1024 caracteres
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "string.base": "La descripción debe ser de tipo cadena de texto.",
      "string.min": "La descripción debe tener al menos 5 caracteres.",
      "string.max": "La descripción no puede tener más de 1024 caracteres.",
    }),
  rut: Joi.string()
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[0-9kK]$/)
    .messages({
      "string.base": "El RUT debe ser una cadena de texto.",
      "string.pattern.base": "El RUT no tiene el formato correcto.",
    }),
  tipo: Joi.string()
    .valid("Positiva", "Negativa") // Definir solo dos valores válidos para el tipo
    .messages({
      "string.base": "El tipo de la anotación debe ser una cadena de texto.",
      "any.only": "El tipo de la anotación debe ser 'Positiva' o 'Negativa'.",
    }),
  id_asignatura: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la asignatura debe ser un número.",
      "number.integer": "El id de la asignatura debe ser un número entero.",
      "number.positive": "El id de la asignatura debe ser un número positivo.",
    }),
})
  .
  unknown(false) // No permite propiedades adicionales;

export const anotacionBodyValidation = Joi.object({
  descripcion: Joi.string()
    .min(5)
    .max(1024) // Limitar la descripción a un máximo de 1024 caracteres
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "string.base": "La descripción debe ser de tipo cadena de texto.",
      "string.min": "La descripción debe tener al menos 5 caracteres.",
      "string.max": "La descripción no puede tener más de 1024 caracteres.",
    }),
  rut: Joi.string()
  .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[0-9kK]$/)
  .required()
    .messages({
      "string.empty": "El RUT es obligatorio.",
      "string.base": "El RUT debe ser una cadena de texto.",
      "string.pattern.base": "El RUT no tiene el formato correcto.",
    }),
  tipo: Joi.string()
    .valid("Positiva", "Negativa")
    .required()
    .messages({
      "string.empty": "El tipo de la anotación es obligatorio.",
      "string.base": "El tipo de la anotación debe ser una cadena de texto.",
      "any.only": "El tipo de la anotación debe ser 'Positiva' o 'Negativa'.",
    }),
  id_asignatura: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id de la asignatura debe ser un número.",
      "number.integer": "El id de la asignatura debe ser un número entero.",
      "number.positive": "El id de la asignatura debe ser un número positivo.",
      "any.required": "El id de la asignatura es obligatorio.",
    }),
})
  .unknown(false) // No permite propiedades adicionales
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
