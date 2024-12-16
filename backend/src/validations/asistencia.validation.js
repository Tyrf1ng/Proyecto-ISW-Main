import Joi from "joi";

export const asistenciaQueryValidation = Joi.object({
    // Validar el id de la asignatura
    id_asignatura: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            "number.base": "El id de la asignatura debe ser un número.",
            "number.integer": "El id de la asignatura debe ser un número entero.",
            "number.positive": "El id de la asignatura debe ser un número positivo.",
            "number.empty": "El id de la asignatura no puede estar vacío."
        }),
    // Validar el id de la asistencia    
    id_asistencia: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "El id de la asistencia debe ser un número.",
            "number.integer": "El id de la asistencia debe ser un número entero.",
            "number.positive": "El id de la asistencia debe ser un número positivo.",
            "number.empty": "El id de la asistencia no puede estar vacío."
        }),
    // Validar el rut del alumno    
    rut: Joi.string()
        .optional()
        .messages({
            "string.empty": "El rut no debe estar vacio",
        }),
    // Validar el tipo de asistencia    
    tipo: Joi.string()
        .optional()
        .valid("Presente", "Ausente", "Justificado")
        .insensitive()
        .messages({
            "any.only": "El tipo de asistencia debe ser 'Presente', 'Ausente' o 'Justificado'.",
            "string.empty": "El tipo de asistencia no debe estar vacío.",
            "string.base": "El tipo de asistencia debe ser un string."
        }),
    // Validar la observación de la asistencia    
    observacion: Joi.string().allow(null).when("tipo", {
        is: "Justificado",
        then: Joi.required().messages({
            "any.required": "La observación es obligatoria cuando el tipo es Justificado"
        }),
        otherwise: Joi.optional()
    }),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    id_curso: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
            "number.base": "El id del curso debe ser un número.",
            "number.integer": "El id del curso debe ser un número entero.",
            "number.positive": "El id del curso debe ser un número positivo.",
            "number.empty": "El id del curso no puede estar vacío."
    })
});