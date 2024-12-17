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
    .get("/",authorize(["Encargado de Laboratorio","Docente"]), getHorarios)         
    .get("/:id_horario",authorize(["Encargado de Laboratorio","Docente"]), getHorario)
    .patch("/update/:id_horario",authorize(["Encargado de Laboratorio"]), updateHorario)
    .delete("/delete/:id_horario",authorize(["Encargado de Laboratorio"]), deleteHorario) 
    .post("/create",authorize(["Encargado de Laboratorio"]), createHorario);
export default router;