"use strict";
import { Router } from "express";
import {
  createReserva,
  deleteReserva,
  getReserva,
  getReservas,
  getReservasByUsuario,
  updateReserva,
} from "../controllers/reserva.controller.js";

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)

router
    .get("/", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), getReservas)
    .get("/:id_reserva", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), getReserva)
    .get("/usuario/:rut", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), getReservasByUsuario)
    .patch("/update/:id_reserva", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), updateReserva)
    .delete("/delete/:id_reserva", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), deleteReserva)
    .post("/create", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), createReserva);

export default router;