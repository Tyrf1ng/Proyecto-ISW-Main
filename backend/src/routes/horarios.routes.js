"use strict";
import { Router } from "express";
import {
    createHorario,
    deleteHorario,
    getHorario,
    getHorarios,
    updateHorario,
    } from "../controllers/horarios.controller.js"
const router = Router();

router
    .get("/", getHorarios)         
    .get("/:id_horario", getHorario)
    .patch("/update/:id_horario", updateHorario)
    .delete("/delete/:id_horario", deleteHorario) 
    .post("/create", createHorario);
export default router;