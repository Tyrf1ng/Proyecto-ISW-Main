"use strict";
import Joi from "joi";
import { isAfter, isWithinInterval, isBefore, isSameDay } from "date-fns";
import { getReservaService } from "../services/reserva.service.js";

export const reservaBodyValidation = Joi.object({
  id_lab: Joi.required(),
  rut: Joi.required(),
  fecha: Joi.date().required(),
  id_horario: Joi.required(),
  id_asignatura: Joi.required(),
  id_curso: Joi.required(),
  id_reserva: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la reserva debe ser un número.",
      "number.integer": "El id de la reserva debe ser un número entero.",
      "number.positive": "El id de la reserva debe ser un número positivo.",
      "number.empty": "El id de la reserva no puede estar vacío."
    }),
}).custom(async (value, helpers) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 31);
  const reservaDate = new Date(value.fecha);

  if (reservaDate.getMonth() === 0 || reservaDate.getMonth() === 1) {
    return helpers.message("No se pueden hacer reservas para los meses de enero y febrero.");
  }

  if (reservaDate.getDay() === 5 || reservaDate.getDay() === 6) {
    return helpers.message("No se pueden hacer reservas los días sábados y domingos.");
  }

  if (!isAfter(reservaDate, today)) {
    return helpers.message("La fecha de la reserva debe ser posterior a la fecha actual.");
  }

  if (!isWithinInterval(reservaDate, { start: today, end: maxDate })) {
    return helpers.message("La fecha de la reserva debe estar dentro del próximo mes.");
  }

  const [existingReserva, error] = await getReservaService({
    id_lab: value.id_lab,
    fecha: value.fecha,
    id_horario: value.id_horario,
  });

  if (existingReserva) {
    return helpers.message("El laboratorio ya está reservado en la misma fecha y horario.");
  }

  return value;
});

export const reservaDeleteValidation = Joi.object({
  id_reserva: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id de la reserva debe ser un número.",
      "number.integer": "El id de la reserva debe ser un número entero.",
      "number.positive": "El id de la reserva debe ser un número positivo.",
      "number.empty": "El id de la reserva no puede estar vacío."
    }),
}).custom(async (value, helpers) => {
  const today = new Date();
  const [reserva, error] = await getReservaService(value.id_reserva);

  if (!reserva) {
    return helpers.message("Reserva no encontrada.");
  }

  const reservaDate = new Date(reserva.fecha);

  if (isBefore(reservaDate, today) || isSameDay(reservaDate, today)) {
    return helpers.message("No se pueden eliminar reservas con fecha actual o anterior.");
  }

  return value;
});