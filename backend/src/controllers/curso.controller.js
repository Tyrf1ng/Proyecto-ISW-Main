"use strict";

import {
    createCurso,
    deleteCurso,
    getAlumnosPorCurso,
    getCurso,
    getCursos,
    getCursosByProfesor,
    updateCurso,
    createConectUsuarioCurso,
} from "../services/curso.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";
import { cursoCreateValidation } from "../validations/curso.validation.js";

export async function getAlumnosPorCursoController(req, res) {
    try {
        const { id_curso } = req.params;
        const [alumnos, errorAlumnos] = await getAlumnosPorCurso(id_curso);
        if (errorAlumnos) return handleErrorClient(res, 404, errorAlumnos);
        handleSuccess(res, 200, "Alumnos del curso encontrados", alumnos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

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
        const { id_curso } = req.params;
        const [curso, errorCurso] = await getCurso(id_curso);
        if (errorCurso) return handleErrorClient(res, 404, errorCurso);
        handleSuccess(res, 200, "Curso encontrado", curso);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createCursoController(req, res) {
    try {
        const  { nombre, nivel, año } = req.body;
        const selectedDate = new Date(año);
        const currentYear = new Date().getFullYear();
        if (selectedDate.getFullYear() !== currentYear) {
            return handleErrorClient(res, 400, "La fecha seleccionada no es del aÃ±o actual.");
        }
        
        const { error } = cursoCreateValidation.validate({ nombre, nivel, año });
        if (error) {
            return res.status(400).json({
                status: "Error",
                message: "Datos inválidos en la solicitud",
                error: error.message,
            });
        }

        const [cursoCreado] = await createCurso(req.body);
        if (!cursoCreado) {
            return res.status(400).json({
                status: "Error",
                message: "No se pudo crear el curso",
            });
        }
        handleSuccess(res, 201, "Curso creado", cursoCreado);
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

export async function getCursosByProfesorController(req, res) {
    try {
        const { rut } = req.params;
        if (!rut) {
            return res.status(400).json({
                status: "Error",
                message: "El parámetro 'rut_docente' es obligatorio"
            });
        }
        const [cursos, mensaje] = await getCursosByProfesor(rut);

        if (!cursos) {
            return res.status(404).json({
                status: "Error",
                message: mensaje
            });
        }
        return res.status(200).json({
            status: "Success",
            message: mensaje,
            data: cursos
        });
    } catch (error) {
        console.error("Error en obtenerCursosPorProfesor:", error);
        return res.status(500).json({
            status: "Error",
            message: "Error interno del servidor"
        });
    }
}

// Nuevo controlador para crear la relación conect_usuario_curso
export async function createConectUsuarioCursoController(req, res) {
    try {
        const { rut, id_curso } = req.body;

        if (!rut || !id_curso) {
            return handleErrorClient(res, 400, "rut e id_curso son requeridos");
        }

        const [relacion, errorRelacion] = await createConectUsuarioCurso(rut, id_curso);
        if (errorRelacion) return handleErrorClient(res, 400, errorRelacion);

        handleSuccess(res, 201, "Relación creada", relacion);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
