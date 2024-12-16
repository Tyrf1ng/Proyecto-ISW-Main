import Joi from "joi";

export const anotacionCreateQueryValidation = Joi.object({
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
    .max(280) 
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "string.base": "La descripción debe ser de tipo cadena de texto.",
      "string.min": "La descripción debe tener al menos 5 caracteres.",
      "string.max": "La descripción no puede tener más de 280 caracteres.",
    }),
  rut: Joi.string()
    .messages({
      "string.base": "El RUT debe ser una cadena de texto.",
    }),
  tipo: Joi.string()
    .valid("Positiva", "Negativa") 
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
  unknown(false) 

  export const anotacionEditQueryValidation = Joi.object({
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
    .max(280) 
    .required()
    .messages({
      "string.empty": "La descripción no puede estar vacía.",
      "string.base": "La descripción debe ser de tipo cadena de texto.",
      "string.min": "La descripción debe tener al menos 5 caracteres.",
      "string.max": "La descripción no puede tener más de 280 caracteres.",
    }),
  tipo: Joi.string()
    .valid("Positiva", "Negativa") 
    .messages({
      "string.base": "El tipo de la anotación debe ser una cadena de texto.",
      "any.only": "El tipo de la anotación debe ser 'Positiva' o 'Negativa'.",
    }),
})
