"use strict";
import { 
    createReservaService,
    deleteReservaService, 
    getReservasByDocenteService,
    getReservasByFechaService,
    getReservasByLabService,
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

// Definición del esquema de validación
const reservaBodyValidation = Joi.object({
    id_lab: Joi.number().integer().required(),
    rut_docente: Joi.string().required(), // Cambiado a string
    fecha: Joi.date().required(),
    id_horario: Joi.number().integer().required(),
});

//Funciona NO TOCAR
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

//Funciona NO TOCAR
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

//Funciona NO TOCAR
export async function createReserva(req, res) {
    try {
        const { id_lab, rut_docente, fecha, id_horario } = req.body;
        if (!id_lab || !rut_docente || !fecha || !id_horario) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios");
        }

        const { error: bodyError } = reservaBodyValidation.validate({ id_lab, rut_docente, fecha, id_horario });
        if (bodyError) return handleErrorClient(res, 400, bodyError.message);

        const [reserva, errorReserva] = await createReservaService({ id_lab, rut_docente, fecha, id_horario });
        if (errorReserva) return handleErrorClient(res, 400, errorReserva);

        handleSuccess(res, 201, "Reserva creada", reserva);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

//Funciona NO TOCAR
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

//Funciona NO TOCAR
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

// Nueva función para obtener reservas por laboratorio
export async function getReservasByLab(req, res) {
    try {
        const { id_lab } = req.params;
        const [reservas, errorReservas] = await getReservasByLabService(id_lab);
        if (errorReservas) return handleErrorClient(res, 404, errorReservas);
        handleSuccess(res, 200, "Reservas encontradas", reservas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Nueva función para obtener reservas por docente
export async function getReservasByDocente(req, res) {
    try {
        const { rut_docente } = req.params;
        const [reservas, errorReservas] = await getReservasByDocenteService(rut_docente);
        if (errorReservas) return handleErrorClient(res, 404, errorReservas);
        handleSuccess(res, 200, "Reservas encontradas", reservas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

// Nueva función para obtener reservas por fecha
export async function getReservasByFecha(req, res) {
    try {
        const { fecha } = req.params;
        const [reservas, errorReservas] = await getReservasByFechaService(fecha);
        if (errorReservas) return handleErrorClient(res, 404, errorReservas);
        handleSuccess(res, 200, "Reservas encontradas", reservas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}