"use strict";
import { 
    createHorarioService,
    deleteHorarioService, 
    getHorarioService, 
    getHorariosService,
    updateHorarioService,
} from "../services/horarios.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

import Joi from "joi";

const horarioBodyValidation = Joi.object({
    hora_inicio: Joi.string().required().custom((value, helpers) => {
        if (value < "08:00" || value > "22:00") {
            return helpers.message("La hora de inicio debe estar entre las 08:00 y las 22:00");
        }
        return value;
    }),
    hora_fin: Joi.string().required().custom((value, helpers) => {
        if (value < "08:00" || value > "22:00") {
            return helpers.message("La hora de fin debe estar entre las 08:00 y las 22:00");
        }
        return value;
    }),
    rut_encargado: Joi.string().required(),
}).custom((value, helpers) => {
    if (value.hora_inicio >= value.hora_fin) {
        return helpers.message("La hora de inicio debe ser menor que la hora de fin");
    }
    return value;
});

export async function getHorario(req, res) {
    try {
        const { id_horario } = req.params; 
        const [horario, errorHorario] = await getHorarioService(id_horario);
        if (errorHorario) return handleErrorClient(res, 404, errorHorario);
        handleSuccess(res, 200, "Horario encontrado", horario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getHorarios(req, res) {
    try {
        const [horarios, errorHorarios] = await getHorariosService();
        if (errorHorarios) return handleErrorClient(res, 404, errorHorarios);
        if (horarios.length === 0) return handleSuccess(res, 204, "No hay horarios");
        handleSuccess(res, 200, "Horarios encontrados", horarios);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createHorario(req, res) {
    try {
        const { hora_inicio, hora_fin, rut_encargado } = req.body;
        if (!hora_inicio || !hora_fin || !rut_encargado) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios");
        }

        const { error: bodyError } = horarioBodyValidation.validate({ hora_inicio, hora_fin, rut_encargado });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [horario, errorHorario] = await createHorarioService({ hora_inicio, hora_fin, rut_encargado });
        if (errorHorario) return handleErrorClient(res, 400, errorHorario);

        handleSuccess(res, 201, "Horario creado", horario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateHorario(req, res) {
    try {
        const { id_horario } = req.params;
        const { body } = req;
        const { error: bodyError } = horarioBodyValidation.validate(body);
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [horario, errorHorario] = await updateHorarioService(id_horario, body);
        if (errorHorario) return handleErrorClient(res, 404, errorHorario);

        handleSuccess(res, 200, "Horario actualizado", horario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteHorario(req, res) {
    try {
        const { id_horario } = req.params;
        const [horario, errorHorario] = await deleteHorarioService(id_horario);
        if (errorHorario) return handleErrorClient(res, 404, errorHorario);
        handleSuccess(res, 200, "Horario eliminado", horario);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}