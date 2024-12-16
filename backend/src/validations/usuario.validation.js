"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.com") && !value.endsWith("@gmail.cl")) {
    return helper.message(
      "El correo electrónico debe ser del dominio @gmail.cl o @gmail.com"
    );
  }
  return value;
};

export const usuarioCreateValidation = Joi.object({
  rut: Joi.string()
  .pattern(/^\d{8,9}[0-9kK]$/) 
    .min(8)
    .max(9)
    .required()
    .messages({
    "string.empty": "El rut no puede estar vacío.",
    "string.min": "El rut debe tener como mínimo 8 caracteres.",
     "string.max": "El rut debe tener como máximo 9 caracteres.",
     "string.pattern.base": "El rut debe ser de la forma 12345678k",
    }),
  nombre: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 20 caracteres."
    }),
  apellido: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El apellido no puede estar vacío.",
      "string.base": "El apellido debe ser de tipo string.",
      "string.min": "El apellido debe tener como mínimo 3 caracteres.",
      "string.max": "El apellido debe tener como máximo 20 caracteres."
    }),
  email: Joi.string()
    .min(15)
    .required()
    .max(40)
    .email()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl o @gmail.com",
      "string.min":
        "El correo electrónico debe tener como mínimo 10 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  password: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener como mínimo 5 caracteres.",
      "string.max": "La contraseña debe tener como máximo 20 caracteres.",
    }),
   direccion: Joi.string()
    .min(10)
    .max(50)
    .messages({
      "string.min": "La dirección debe tener como mínimo 10 caracteres.",
      "string.max": "La dirección debe tener como máximo 50 caracteres.", 
}),
comuna: Joi.string()
    .min(5)
    .max(30)
    .messages({
      "string.min": "La comuna debe tener como mínimo 5 caracteres.",
      "string.max": "La comuna debe tener como máximo 30 caracteres.", 
}),
telefono: Joi.number()
.min(10000000)
.max(99999999)
.required()
.messages({
"number.base": "El teléfono debe ser un número.",
"number.empty": "El teléfono no puede estar vacío.",
"number.min": "El teléfono debe tener como mínimo 8 dígitos.",
"number.max": "El teléfono debe tener como máximo 8 dígitos.",
}),
id_roles: Joi.number()
.required()
.messages({
"number.base": "El id del rol debe ser un número.",
"number.empty": "El id del rol no puede estar vacío.",
}),
})

export const usuarioEditValidation = Joi.object({
  rut: Joi.string()
  .required()
  .messages({
    "string.empty": "El rut no puede estar vacío.",
    }),
  nombre: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .optional()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 20 caracteres."
    }),
  apellido: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .optional()
    .messages({
      "string.empty": "El apellido no puede estar vacío.",
      "string.base": "El apellido debe ser de tipo string.",
      "string.min": "El apellido debe tener como mínimo 3 caracteres.",
      "string.max": "El apellido debe tener como máximo 20 caracteres."
    }),
  email: Joi.string()
    .min(15)
    .optional()
    .max(40)
    .email()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl o @gmail.com",
      "string.min":
        "El correo electrónico debe tener como mínimo 10 caracteres.",
      "string.max":
        "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  password: Joi.string()
    .min(5)
    .max(20)
    .optional()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener como mínimo 5 caracteres.",
      "string.max": "La contraseña debe tener como máximo 20 caracteres.",
    }),
   direccion: Joi.string()
    .min(10)
    .max(50)
    .optional()
    .messages({
      "string.min": "La dirección debe tener como mínimo 10 caracteres.",
      "string.max": "La dirección debe tener como máximo 50 caracteres.", 
}),
comuna: Joi.string()
    .min(5)
    .max(30)
    .optional()
    .messages({
      "string.min": "La comuna debe tener como mínimo 5 caracteres.",
      "string.max": "La comuna debe tener como máximo 30 caracteres.", 
}),
telefono: Joi.number()
.min(10000000)
.max(99999999)
.optional()
.messages({
"number.base": "El teléfono debe ser un número.",
"number.empty": "El teléfono no puede estar vacío.",
"number.min": "El teléfono debe tener como mínimo 8 dígitos.",
"number.max": "El teléfono debe tener como máximo 8 dígitos.",
}),

})