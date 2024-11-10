"use strict";
import { Router } from "express";
import {
  createReserva,
  deleteReserva,
  getReserva,
  getReservas,
  getReservasByDocente,
  getReservasByFecha,
  getReservasByLab,
  updateReserva,
} from "../controllers/reserva.controller.js";

const router = Router();

router
    .get("/", getReservas)         
    .get("/:id_reserva", getReserva)
    .get("/lab/:id_lab", getReservasByLab) // Nueva ruta para obtener reservas por laboratorio
    .get("/docente/:rut_docente", getReservasByDocente) // Nueva ruta para obtener reservas por docente
    .get("/fecha/:fecha", getReservasByFecha) // Nueva ruta para obtener reservas por fecha
    .patch("/update/:id_reserva", updateReserva)
    .delete("/delete/:id_reserva", deleteReserva) 
    .post("/create", createReserva);

export default router;