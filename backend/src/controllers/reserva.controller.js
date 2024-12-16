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

import { reservaBodyValidation, reservaDeleteValidation } from "../validations/reserva.validation.js";

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
        handleSuccess(res, 200, "Reservas encontradas", reservas);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createReserva(req, res) {
  try {
    const { error: bodyError } = await reservaBodyValidation.validateAsync(req.body);
    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [reserva, errorReserva] = await createReservaService(req.body);
    if (errorReserva) return handleErrorClient(res, 400, errorReserva);

    handleSuccess(res, 201, "Reserva creada", reserva);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateReserva(req, res) {
  try {
    const { id_reserva } = req.params;
    const { error: bodyError } = await reservaBodyValidation.validateAsync(req.body);
    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [reserva, errorReserva] = await updateReservaService(id_reserva, req.body);
    if (errorReserva) return handleErrorClient(res, 400, errorReserva);

    handleSuccess(res, 200, "Reserva actualizada", reserva);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteReserva(req, res) {
  try {
    const { error: bodyError } = await reservaDeleteValidation.validateAsync(req.params);
    if (bodyError) return handleErrorClient(res, 400, bodyError.message);

    const [deleteResult, errorDelete] = await deleteReservaService(req.params.id_reserva);
    if (errorDelete) return handleErrorClient(res, 404, errorDelete);

    handleSuccess(res, 200, "Reserva eliminada", deleteResult);
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