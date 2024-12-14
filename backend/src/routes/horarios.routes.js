"use strict";
import { Router } from "express";
import {
    createHorario,
    deleteHorario,
    getHorario,
    getHorarios,
    updateHorario,
    } from "../controllers/horarios.controller.js"

import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
   
const router = Router();

router
    .use(authenticateJwt)

router
    .get("/",authorize(["Encargado de Laboratorio","Administrador","Directivo","Docente"]), getHorarios)         
    .get("/:id_horario",authorize(["Encargado de Laboratorio","Administrador","Directivo","Docente"]), getHorario)
    .patch("/update/:id_horario",authorize(["Encargado de Laboratorio","Administrador","Directivo"]), updateHorario)
    .delete("/delete/:id_horario",authorize(["Encargado de Laboratorio","Administrador","Directivo"]), deleteHorario) 
    .post("/create",authorize(["Encargado de Laboratorio","Administrador","Directivo"]), createHorario);
export default router;