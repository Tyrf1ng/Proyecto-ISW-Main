"use strict";
import { Router } from "express";
import { createAnotacion,
         deleteAnotacion,
         getAnotacion,
         getAnotaciones,
         getAnotacionesAlumno,
         getAnotacionesAsignatura,
         getAnotacionesCurso,
         updateAnotacion } from "../controllers/anotaciones.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .get("/", getAnotaciones)         
  .get("/anotacion/:id_anotacion", getAnotacion)
  .get("/asignatura/:id_asignatura", getAnotacionesAsignatura)
  .get("/alumno/:rut_alumno", getAnotacionesAlumno)
  .get("/curso/:id_curso", getAnotacionesCurso)
  .post("/crear/", createAnotacion)
  .put("/actualizar/:id_anotacion", updateAnotacion)
  .delete("/borrar/:id_anotacion", deleteAnotacion)
  export default router;
