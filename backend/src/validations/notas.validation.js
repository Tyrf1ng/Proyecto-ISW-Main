"use strict";
import Joi from "joi";

export const notasQueryValidation = Joi.object({
id_nota: Joi.number()
.messages({
"number.empty": "El id del curso no puede estar vacío." }),
id_asignatura: Joi.number()
.messages({
"number.empty": "El id de la asignatura no puede estar vacío." }),
rut: Joi.string()
.messages({
"string.empty": "El rut del alumno no puede estar vacío." }),
valor: Joi.number()
.min(1.0)
.required()
.max(7.0)
.messages({
"number.base": "El valor de la nota debe ser un número.",
"number.min": "El valor de la nota debe ser mayor o igual a 1.0.",
"number.max": "El valor de la nota debe ser menor o igual a 7.0.",
"number.empty": "El valor de la nota no puede estar vacío."
}),
tipo: Joi.string()
.valid("Prueba", "Tarea", "Presentacion","Test")
.messages({
"string.base": "El tipo de nota debe ser Prueba/Tarea/Test/Presentacion.",
"string.empty": "El tipo de nota no puede estar vacío.",
"string.min": "El tipo de nota debe tener al menos 3 caracteres.",
"string.max": "El tipo de nota debe tener como máximo 100 caracteres."
}),

}) 

