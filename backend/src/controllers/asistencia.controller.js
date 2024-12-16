"use strict";
import { asistenciaQueryValidation } from "../validations/asistencia.validation.js"

import {
    getAsistenciasAlumnoFecha,
    createAsistenciasService,
    updateAsistencia,
    deleteAsistencia,
    getAsistenciasPorCursoYAsignaturaService,
    getAsistenciasPorRutYAsignaturaService,
} from "../services/asistencia.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

// Obtener las asistencias de un alumno para una fecha, se utiliza al momento de crear una asistencia para verificar si ya existe una asistencia para ese alumno en esa fecha
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

// Funcion para crear una asistencia
export async function createAsistenciaController(req, res) {
    try {

        const { id_asignatura, rut, tipo, observacion, createdAt } = req.body;
        const selectedDate = new Date(createdAt);
        const currentYear = new Date().getFullYear();

        if (!createdAt) {
            return handleErrorClient(res, 400, "La fecha no puede estar vacia");
        }

        if (selectedDate.getFullYear() !== currentYear) {
            return handleErrorClient(res, 400, "La fecha seleccionada no es del año actual.");
        }

        if (new Date(selectedDate) > new Date()) {
            setMensaje("No se puede registrar asistencia en fechas futuras.");
            setMessageType("error");
            return;
        }

        const dayOfWeek = selectedDate.getUTCDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return handleErrorClient(res, 400, "No se puede registrar asistencia en fines de semana (sábado o domingo).");
        }

        const [asistenciaCreada, errorAsistencia] = await createAsistenciasService({
            id_asignatura,
            rut,
            tipo,
            observacion,
            createdAt
        });

        if (errorAsistencia)
            return handleErrorClient(res, 404, errorAsistencia);
        handleSuccess(res, 201, "Asistencia creada", asistenciaCreada);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Funcion para actualizar una asistencia
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

// Funcion para eliminar una asistencia
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

// Funcion para obtener las asistencias de un alumno por asignatura sirve para las asistencias desde la vista del alumno
export async function getAsistenciasPorCursoYAsignatura(req, res) {
    try {

        const { id_curso, id_asignatura } = req.params;

        //validar parametros
        if (!id_curso || !id_asignatura) {
            return handleErrorClient(res, 400,
                "Los parametros 'id_curso' e 'id_asignatura' son requeridos"
            );
        }

        //llamar al servicio
        const [asistencias, error] = await getAsistenciasPorCursoYAsignaturaService(id_curso, id_asignatura);

        if (error) return handleErrorClient(res, 404, error);

        handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        console.error("Error en el controller de obtener asistencias por curso y asignatura:", error);
        handleErrorServer(res, 500, error.message);
    }
}

// Funcion para obtener las asistencias de un alumno por asignatura sirve para las asistencias desde la vista del profesor
export async function getAsistenciasPorRutYAsignatura(req, res) {
    try {

        const { rut, id_asignatura } = req.params;

        //validar que ambos parametros esten presentes

        if (!rut || !id_asignatura) {
            return handleErrorClient(res, 400,
                "Los parametros 'rut' y 'id_asignatura' son requeridos"
            );
        }

        //validar que id_asignatura sea un numero valido
        const idAsignatura = parseInt(id_asignatura, 10);
        if (isNaN(idAsignatura)) {
            return handleErrorClient(res, 400,
                "'id_asignatura' debe ser un numero valido"
            );
        }
        //llamar al servicio
        const [asistencias, error] = await getAsistenciasPorRutYAsignaturaService(rut, idAsignatura);

        if (error) {
            return handleErrorClient(res, 404, error);
        }

        //retornar las asistencias
        handleSuccess(res, 200, "Anotaciones encontradas", asistencias);
    } catch (error) {
        console.error("Error en el controller de obtener asistencias por rut y asignatura:", error);
        handleErrorServer(res, 500, "Error interno en el servidor");
    }
}
