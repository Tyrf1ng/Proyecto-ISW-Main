"use strict";
import { Router } from "express";
import {
    createLab,
    deleteLab,
    getLab,
    getLabs,
    updateLab,
  } from "../controllers/lab.controller.js"

  import { authenticateJwt } from "../middlewares/authentication.middleware.js";
  import authorize from "../middlewares/authorization.middleware.js";
  const router = Router();

router
    .use(authenticateJwt)

router
    .get("/",authorize(["Encargado de Laboratorio","Docente"]), getLabs)         
    .get("/:id_lab",authorize(["Encargado de Laboratorio","Docente"]), getLab)
    .patch("/update/:id_lab",authorize(["Encargado de Laboratorio"]), updateLab)
    .delete("/delete/:id_lab",authorize(["Encargado de Laboratorio"]), deleteLab) 
    .post("/create",authorize(["Encargado de Laboratorio"]), createLab);
export default router;