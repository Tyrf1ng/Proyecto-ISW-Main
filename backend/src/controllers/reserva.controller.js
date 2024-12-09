"use strict";
import { 
    createReservaService,
    deleteReservaService, 
    getReservasByUsuarioService,
    getReservaService, 
    getReservasService,
    updateReservaService,
} from "../services/reserva.service.js";

import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

import Joi from "joi";

const reservaBodyValidation = Joi.object({
    id_lab: Joi.number().integer().required(),
    rut: Joi.string().required(),
    fecha: Joi.date().required(),
    id_horario: Joi.number().integer().required(),
    id_asignatura: Joi.number().integer().required(),
    id_curso: Joi.number().integer().required(),
});

export async function getReserva(req, res) {
    try {
        const { id_reserva } = req.params; 
        const [reserva, errorReserva] = await getReservaService(id_reserva);
        if (errorReserva) return handleErrorClient(res, 404, errorReserva);
        handleSuccess(res, 200, "Reserva encontrada", reserva);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getReservas(req, res) {
    try {
        const [reservas, errorReservas] = await getReservasService();
        if (errorReservas) return handleErrorClient(res, 404, errorReservas);
        if (reservas.length === 0) return handleSuccess(res, 204, "No hay reservas");
        handleSuccess(res, 200, "Reservas encontradas", reservas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createReserva(req, res) {
    try {
        const { id_lab, rut, fecha, id_horario, id_asignatura, id_curso } = req.body;
        if (!id_lab || !rut || !fecha || !id_horario || !id_asignatura || !id_curso) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios");
        }

        const { error: bodyError } = reservaBodyValidation.validate({ id_lab, rut, fecha, id_horario, id_asignatura, id_curso });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [reserva, errorReserva] = await createReservaService({ id_lab, rut, fecha, id_horario, id_asignatura, id_curso });
        if (errorReserva) return handleErrorClient(res, 400, errorReserva);

        handleSuccess(res, 201, "Reserva creada", reserva);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateReserva(req, res) {
    try {
        const { id_reserva } = req.params;
        const { body } = req;
        const { error: bodyError } = reservaBodyValidation.validate(body);
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [reserva, errorReserva] = await updateReservaService(id_reserva, body);
        if (errorReserva) return handleErrorClient(res, 404, errorReserva);

        handleSuccess(res, 200, "Reserva actualizada", reserva);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteReserva(req, res) {
    try {
        const { id_reserva } = req.params;
        const [reserva, errorReserva] = await deleteReservaService(id_reserva);
        if (errorReserva) return handleErrorClient(res, 404, errorReserva);
        handleSuccess(res, 200, "Reserva eliminada", reserva);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getReservasByUsuario(req, res) {
    try {
        const { rut } = req.params;
        const [reservas, errorReservas] = await getReservasByUsuarioService(rut);
        if (errorReservas) return handleErrorClient(res, 404, errorReservas);
        handleSuccess(res, 200, "Reservas encontradas", reservas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}