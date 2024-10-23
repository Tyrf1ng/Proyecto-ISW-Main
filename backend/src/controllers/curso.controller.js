"use strict";
import {
  createCursoService,
  deleteCursoService,
  getCursoService,
  getCursosService,
  updateCursoService,
} from "../services/curso.service.js";
import {
  cursoBodyValidation,
  cursoQueryValidation,
} from "../validations/curso.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getCurso(req, res) {
  try {
    const { id, usuarioId, nombre } = req.query;

    const { error } = cursoQueryValidation.validate({ id, usuarioId, nombre });

    if (error) return handleErrorClient(res, 400, error.message);

    const [curso, errorCurso] = await getCursoService({ id, usuarioId, nombre });

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
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createCurso(req, res) {
  try {
    const { body } = req;

    const { error: bodyError } = cursoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [curso, cursoError] = await createCursoService(body);

    if (cursoError) return handleErrorClient(res, 400, "Error creando el curso", cursoError);

    handleSuccess(res, 201, "Curso creado correctamente", curso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateCurso(req, res) {
  try {
    const { id, usuarioId } = req.query;
    const { body } = req;

    const { error: queryError } = cursoQueryValidation.validate({ id, usuarioId });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const { error: bodyError } = cursoBodyValidation.validate(body);

    if (bodyError)
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        bodyError.message,
      );

    const [curso, cursoError] = await updateCursoService({ id, usuarioId }, body);

    if (cursoError) return handleErrorClient(res, 400, "Error modificando el curso", cursoError);

    handleSuccess(res, 200, "Curso modificado correctamente", curso);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteCurso(req, res) {
  try {
    const { id, usuarioId } = req.query;

    const { error: queryError } = cursoQueryValidation.validate({ id, usuarioId });

    if (queryError) {
      return handleErrorClient(
        res,
        400,
        "Error de validación en la consulta",
        queryError.message,
      );
    }

    const [cursoDelete, errorCursoDelete] = await deleteCursoService({ id, usuarioId });

    if (errorCursoDelete) return handleErrorClient(res, 404, "Error eliminando el curso", errorCursoDelete);

    handleSuccess(res, 200, "Curso eliminado correctamente", cursoDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
