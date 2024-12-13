"use strict";
import { asistenciaQueryValidation } from "../validations/asistencia.validation.js"
import { getAsistenciasAlumnoAsignatura } from "../services/asistencia.service.js";

import {
    createAsistencia,
    deleteAsistencia,
    getAsistencia,
    getAsistenciasAlumno,
    getAsistenciasAsignatura,
    getAsistenciasCurso,
    updateAsistencia,
    getAsistenciasAlumnoFecha
} from "../services/asistencia.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";


export async function getAsistenciasAlumnoFechaController(req, res) {
    try {
        const { rut, fecha, id_asignatura } = req.params;

        const [asistencias, errorAsistencias] = await getAsistenciasAlumnoFecha(rut, fecha, id_asignatura);

        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);

        asistencias.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}



export async function getAsistenciasCursoController(req, res) {
    try {
        const { id_curso } = req.params;

        const [asistencias, errorAsistencias] = await getAsistenciasCurso(id_curso);

        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);

        asistencias.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciasAlumnoController(req, res) {
    try {
        const { rut } = req.params;

        const [asistencias, errorAsistencias] = await getAsistenciasAlumno(rut);

        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);

        asistencias.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciasAsignaturaController(req, res) {
    try {
        const { id_asignatura, id_curso } = req.params;
        const [asistencias, errorAsistencias] = await getAsistenciasAsignatura(id_asignatura, id_curso);
        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);
        asistencias.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciaController(req, res) {
    try {
        const { id_asistencia } = req.params;

        const [asistencia, errorAsistencia] = await getAsistencia(id_asistencia);

        if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);

        handleSuccess(res, 200, "Asistencia encontrada", asistencia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export const updateAsistenciaController = async (req, res) => {
    try {
        const { id_asistencia } = req.params;
        const { tipo, observacion } = req.body;

        const updatedObservacion = (tipo === "Presente" || tipo === "Ausente") ? null : observacion;

        const { error: validationError } = asistenciaQueryValidation.validate({ tipo, observacion: updatedObservacion });
        if (validationError) {
            return handleErrorClient(res, 400, "Datos de entrada no válidos", validationError.details[0].message);
        }

        const [asistenciaActualizada, error] = await updateAsistencia(id_asistencia, tipo, updatedObservacion);
        if (error) {
            return handleErrorClient(res, 404, error);
        }

        handleSuccess(res, 200, "Asistencia actualizada", asistenciaActualizada);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
};

export async function createAsistenciaController(req, res) {
    try {
        const { error: validationError, value } = asistenciaQueryValidation.validate(req.body);
        if (validationError) {
            return handleErrorClient(res, 400, validationError.details[0].message);
        }
        
        const { id_asignatura, id_curso, rut, tipo, observacion, createdAt } = value;
        const selectedDate = new Date(createdAt);
        const currentYear = new Date().getFullYear();

        if (!createdAt) {
            return handleErrorClient(res, 400, "La fecha no puede estar vacia");
        }

        if (selectedDate.getFullYear() !== currentYear) {
            return handleErrorClient(res, 400, "La fecha seleccionada no es del año actual.");
        }

        if(selectedDate.getDate() > new Date().getDate()) {
            return handleErrorClient(res, 400, "La fecha seleccionada no puede ser mayor a la fecha actual.");
        }

        const dayOfWeek = selectedDate.getUTCDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return handleErrorClient(res, 400, "No se puede registrar asistencia en fines de semana (sábado o domingo).");
        }

        const [asistenciaCreada, errorAsistencia] = await createAsistencia({ id_asignatura, id_curso, rut, tipo, observacion, createdAt });
        if (errorAsistencia) {
            return handleErrorClient(res, 400, errorAsistencia);
        }

        handleSuccess(res, 201, "Asistencia creada", asistenciaCreada);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteAsistenciaController(req, res) {
    try {
        const { id_asistencia } = req.params;

        const [asistencia, errorAsistencia] = await deleteAsistencia(id_asistencia);

        if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);

        handleSuccess(res, 200, "Asistencia eliminada", asistencia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciasAlumnoAsignaturaController(req, res) {
    try {
      const { rut, id_asignatura } = req.params;
      const [asistencias, errorAsistencias] = await getAsistenciasAlumnoAsignatura(rut, id_asignatura);
  
      if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);
  
      asistencias.length === 0
        ? handleSuccess(res, 204)
        : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }