"use strict";
import {
    createNota,
    deleteNota,
    getNotasAlumnoAsignatura,
    getNotasAsignatura,
    getNotasPorCursoYAsignatura,
    updateNota
   
} from "../services/notas.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
  } from "../handlers/responseHandlers.js";

import { notasCreateValidation, notasEditValidation } from "../validations/notas.validation.js";

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

export const updateNotaController = async (req, res) => {
    try {
        const { id_nota } = req.params;
        const { valor, tipo } = req.body;

        if (!id_nota) {
            return res.status(400).json({ message: "El id de la nota es requerido" });
        }

        const { error } = notasEditValidation.validate({ valor, tipo, id_nota });
        if (error) {
            return res.status(400).json({
                message: "Datos inválidos en la solicitud",
                error: error.message,
            });
        }

        const [notaActualizada, errorMessage] = await updateNota(id_nota, valor, tipo);
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
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export async function createNotaController(req, res) {
    try {
        const { id_asignatura, rut, valor, tipo } = req.body;
        const { error } = notasCreateValidation.validate(req.body);

        if (error) {
            return handleErrorClient(res, 400, "Datos inválidos", error.message); // Mensaje más descriptivo
        }
        const [notaCreada] = await createNota({
            id_asignatura,
            rut,
            tipo,
            valor,
        });
        if (!notaCreada) {
            return handleErrorClient(res, 400, "No se pudo crear la nota. Verifica los datos proporcionados.");
        }
        handleSuccess(res, 201, "Nota creada exitosamente", notaCreada);
    } catch (error) {
        // Manejar errores del servidor
        handleErrorServer(res, 500, "Error interno del servidor", error.message);
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
        const { rut, id_asignatura } = req.params;
        if (!rut || !id_asignatura) {
            return handleErrorClient(
                res,
                400,
                "Los parámetros 'rut' e 'id_asignatura' son obligatorios"
            );
        }

        const idAsignatura = parseInt(id_asignatura, 10);
        if (isNaN(idAsignatura)) {
            return handleErrorClient(
                res,
                400,
                "'id_asignatura' debe ser un número válido"
            );
        }

        const [notas, errorNotas] = await getNotasAlumnoAsignatura(rut, idAsignatura);

        if (errorNotas) return handleErrorClient(res, 404, errorNotas);

        notas.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Notas encontradas", notas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
    
}   

export async function getNotasPorCursoYAsignaturaController(req, res) {
    try {
        const { id_curso, id_asignatura } = req.params;

        // Validar parámetros
        if (!id_curso || !id_asignatura) {
            return handleErrorClient(
                res,
                400,
                "Los parámetros 'id_curso' e 'id_asignatura' son obligatorios"
            );
        }

        // Llamar al servicio
        const [notas, error] = await getNotasPorCursoYAsignatura(id_curso, id_asignatura);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Notas encontradas", notas);
    } catch (error) {
        console.error("Error en el controller de obtener Notas por curso y asignatura:", error);
        handleErrorServer(res, 500, error.message);
    }
}
