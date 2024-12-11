"use strict";
import {
    createNota,
    deleteNota,
    getNota,
    getNotasAlumno,
    getNotasAlumnoAsignatura,
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
    try {
        const { id_nota } = req.params;
        const { valor, tipo } = req.body;
        if (!id_nota) {
            return res.status(400).json({
                message: "El id de la nota es requerido",
            });
        }

        const { error } = notasQueryValidation.validate({ valor, tipo, id_nota });
        if (error) {
            return res.status(400).json({
                message: "Datos inválidos en la solicitud",
                error: error.message,
            });
        }

        const parsedValor = parseFloat(valor);
        if (isNaN(parsedValor)) {
            return res.status(400).json({
                message: "El valor debe ser un número válido",
            });
        }
        const [notaActualizada, errorMessage] = await updateNota(id_nota, parsedValor, tipo);
        if (errorMessage) {
            return res.status(400).json({
                message: "No se pudo actualizar la nota",
                error: errorMessage,
            });
        }
        
        return res.status(200).json({
            message: "Nota actualizada correctamente",
            data: notaActualizada,
        });
    } catch (error) {
        console.error("Error en updateNotaController:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
        });
    }
};

export async function createNotaController(req, res) {
    try {
        const { id_asignatura, rut, valor, tipo } = req.body;
        const { error } = notasQueryValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios", error.message);
        }

        const [notaCreada] = await createNota({
            id_asignatura,
            rut,
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

export async function getNotasAlumnoAsignaturaController(req, res) {
    try {
        const { rut_alumno, id_asignatura } = req.params;

        const [notas, errorNotas] = await getNotasAlumnoAsignatura(rut_alumno, id_asignatura);

        if (errorNotas) return handleErrorClient(res, 404, errorNotas);

        notas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Notas encontradas", notas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
    
}   