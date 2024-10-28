"use strict";
import {
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
    const { nuevoValor } = req.body;  
    const [notaActualizada, error] = await updateNota(id_nota, nuevoValor);
    if (error) {
        return res.status(404).json({ message: error });
    }

    return res.json(notaActualizada);
};