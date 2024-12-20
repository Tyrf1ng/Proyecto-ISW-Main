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
    .get("/",authorize(["Directivo","Encargado de Laboratorio","Docente"]), getLabs)         
    .get("/:id_lab",authorize(["Directivo","Encargado de Laboratorio","Docente"]), getLab)
    .patch("/update/:id_lab",authorize(["Directivo","Encargado de Laboratorio"]), updateLab)
    .delete("/delete/:id_lab",authorize(["Directivo","Encargado de Laboratorio"]), deleteLab) 
    .post("/create",authorize(["Directivo","Encargado de Laboratorio"]), createLab);
export default router;