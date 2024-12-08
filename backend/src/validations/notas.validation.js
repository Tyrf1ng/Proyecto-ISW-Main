"use strict";
import Joi from "joi";

export const notasQueryValidation = Joi.object({
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
valor: Joi.number()
.min(1.0)
.required()
.max(7.0)
.positive()
.messages({
"number.base": "El valor de la nota debe ser un número.",
"number.min": "El valor de la nota debe ser mayor o igual a 1.0.",
"number.max": "El valor de la nota debe ser menor o igual a 7.0.",
"number.empty": "El valor de la nota no puede estar vacío."
}),
tipo: Joi.string()
.required()
.min(3)
.max(100)
.messages({
"string.base": "El tipo de nota debe ser un string.",
"string.empty": "El tipo de nota no puede estar vacío.",
"string.min": "El tipo de nota debe tener al menos 3 caracteres.",
"string.max": "El tipo de nota debe tener como máximo 100 caracteres."
}),
rut: Joi.string()
.required()
.min(9)
.max(12)
.pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
.messages({
"string.empty": "El rut del alumno no puede estar vacío.",
"string.base": "El rut del alumno debe ser de tipo string.",
"string.min": "El rut del alumno debe tener al menos 9 caracteres.",
"string.max": "El rut del alumno debe tener como máximo 12 caracteres.",
"string.pattern.base": "El rut del alumno debe tener un formato válido: xx.xxx.xxx-x o xxxxxxxx-x."
})
}) 

