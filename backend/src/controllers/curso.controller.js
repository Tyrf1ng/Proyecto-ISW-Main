"use strict";
import { getCursoService, getCursosService } from "../services/curso.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
export async function getCurso(req, res) {
    try {
        const { id_Curso, nombreCurso, nivel, rutDocente } = req.query;
        const [curso, errorCurso] = await getCursoService({ id_Curso, nombreCurso, nivel, rutDocente });
        if (errorCurso) return handleErrorClient(res, 404, errorCurso);
        handleSuccess(res, 200, "Curso encontrado", curso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
export async function getCursos(req, res) {
    try {
        const [cursos, errorCursos] = await getCursosService();
        if (errorCursos) return handleErrorClient(res, 404, errorCursos);
        cursos.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Cursos encontrados", cursos);
    }catch (error) {
        handleErrorServer(
            res,
            500,
            error.message,
        );
    }
}