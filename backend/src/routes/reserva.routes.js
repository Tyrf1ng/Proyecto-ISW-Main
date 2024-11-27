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
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .get("/",authorize(["Directivo","Administrador","Docente","Encargado de Laboratorio"]), getReservas)         
    .get("/:id_reserva",authorize(["Directivo","Administrador","Docente","Encargado de Laboratorio"]), getReserva)
    .get("/lab/:id_lab",authorize(["Directivo","Administrador","Docente","Encargado de Laboratorio"])
    ,getReservasByLab) 
    .get("/docente/:rut_docente",authorize(["Directivo","Administrador","Docente","Encargado de Laboratorio"])
    ,getReservasByDocente)
    .get("/fecha/:fecha",authorize(["Directivo","Administrador","Docente","Encargado de Laboratorio"])
    ,getReservasByFecha) 
    .patch("/update/:id_reserva",authorize(["Directivo","Administrador","Encargado de Laboratorio"]), updateReserva)
    .delete("/delete/:id_reserva",authorize(["Directivo","Administrador","Encargado de Laboratorio"]), deleteReserva) 
    .post("/create",authorize(["Directivo","Administrador","Docente","Encargado de Laboratorio"]), createReserva);

export default router;