"use strict";

import{
    createCurso,
    deleteCurso,
    getCurso,
    getCursos,
    updateCurso,
}from "../services/curso.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
}from "../handlers/responseHandlers.js";

export async function getCursosController(req, res) {
    try {
        const [cursos, errorCursos] = await getCursos();
        if (errorCursos) return handleErrorClient(res, 404, errorCursos);
        cursos.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Cursos encontrados", cursos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getCursoController(req, res) {
    try {
        const { id_curso } = req.params; // Cambiar 'id' a 'id_curso'
        const [curso, errorCurso] = await getCurso(id_curso);
        if (errorCurso) return handleErrorClient(res, 404, errorCurso);
        handleSuccess(res, 200, "Curso encontrado", curso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createCursoController(req, res) {
    try {
        const [curso, errorCurso] = await createCurso(req.body);
        if (errorCurso) return handleErrorClient(res, 400, errorCurso);
        handleSuccess(res, 201, "Curso creado", curso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateCursoController(req, res) {
    try {
        const { id_curso } = req.params;
        const [curso, errorCurso] = await updateCurso(id_curso, req.body);
        if (errorCurso) return handleErrorClient(res, 404, errorCurso);
        handleSuccess(res, 200, "Curso actualizado", curso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


// deleteCursoController en curso.controller.js
export async function deleteCursoController(req, res) {
    try {
        const { id_curso } = req.params; 
        const [curso, errorCurso] = await deleteCurso(id_curso);
        if (errorCurso) return handleErrorClient(res, 404, errorCurso);
        handleSuccess(res, 200, "Curso eliminado", curso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}


