"use strict";
import {
    createNota,
    deleteNota,
    getAllNotas,
    getNota,
    getNotasAlumno,
    getNotasAsignatura,
    getNotasCurso,
    updateNota
   
} from "../services/notas.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
  } from "../handlers/responseHandlers.js";

import { notasQueryValidation } from "../validations/notas.validation.js";

export async function getNotasCursoController(req, res) {
    try {
        const { id_curso } = req.params;

        const [notas, errorNotas] = await getNotasCurso(id_curso);

        if (errorNotas) return handleErrorClient(res, 404, errorNotas);

        notas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Notas encontradas", notas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getNotasAlumnoController(req, res) {
    try {
        const { rut_alumno } = req.params;

        const [notas, errorNotas] = await getNotasAlumno(rut_alumno);

        if (errorNotas) return handleErrorClient(res, 404, errorNotas);

        notas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Notas encontradas", notas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

 export async function getNotasAsignaturaController(req, res) { 
    try { 
        const { id_asignatura } = req.params; 
        const [notas, errorNotas] = await getNotasAsignatura(id_asignatura); 
        if (errorNotas) return handleErrorClient(res, 404, errorNotas); 
        notas.length === 0 ? handleSuccess(res, 204) : handleSuccess(res, 200, "Notas encontradas", notas); 
    } catch (error) { 
        handleErrorServer(res, 500, error.message); 
    }
}

export async function getNotaController(req, res) {
    try {
        const { id_nota } = req.params;

        const [nota, errorNota] = await getNota(id_nota);

        if (errorNota) return handleErrorClient(res, 404, errorNota);

        handleSuccess(res, 200, "Nota encontrada", nota);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export const updateNotaController = async (req, res) => {
    const { id_nota } = req.params;
    const { valor } = req.body;  // Asegúrate de que 'valor' sea lo que estás esperando desde el frontend

    // Valida si el valor es correcto y asegúrate de que sea un número
    const parsedValor = parseFloat(valor);
    if (isNaN(parsedValor)) {
        return handleErrorClient(res, 400, "El valor debe ser un número válido");
    }

    // Llama a la función de actualización
    const [notaActualizada, errorMessage] = await updateNota(id_nota, parsedValor);  // Pasa el valor convertido

    if (errorMessage) {
        return handleErrorClient(res, 400, "No se pudo actualizar la nota", errorMessage);
    }

    // Responde con éxito y los datos de la nota actualizada
    return res.status(200).json({
        message: "Nota actualizada correctamente",
        data: notaActualizada
    });
};
export async function createNotaController(req, res) {
    try {
        const { id_asignatura, rut_alumno, valor, tipo } = req.body;
        const { error } = notasQueryValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios", error.message);
        }

        const [notaCreada] = await createNota({
            id_asignatura,
            rut_alumno,
            tipo,
            valor,
        });
        const { errorNota } = notasQueryValidation.validate(notaCreada);

        if (errorNota) return handleErrorClient(res, 400, errorNota);

        handleSuccess(res, 201, "Nota creada", notaCreada);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteNotasController(req, res) {
    try {
        const { id_nota } = req.params;

        const [nota, errorNota] = await deleteNota(id_nota);

        if (errorNota) return handleErrorClient(res, 404, errorNota);

        handleSuccess(res, 200, "Nota eliminada", nota);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAllNotasController(req, res) {
    try {
        const [notas, errorNotas] = await getAllNotas();

        if (errorNotas) return handleErrorClient(res, 404, errorNotas);

        notas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Notas encontradas", notas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}