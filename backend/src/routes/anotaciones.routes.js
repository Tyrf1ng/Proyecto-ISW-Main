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
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .get("/",authorize(["Docente","Director"]), getAnotaciones)         
  .get("/anotacion/:id_anotacion",authorize(["Docente","Director"]), getAnotacion)
  .get("/asignatura/:id_asignatura",authorize(["Docente","Director"]), getAnotacionesAsignatura)
  .get("/alumno/:rut_alumno",authorize(["Alumno","Director","Docente"]), getAnotacionesAlumno)
  .get("/curso/:id_curso",authorize(["Docente","Director"]), getAnotacionesCurso)
  .post("/crear/",authorize(["Docente","Director"]), createAnotacion)
  .put("/actualizar/:id_anotacion",authorize(["Docente","Director"]), updateAnotacion)
  .delete("/borrar/:id_anotacion",authorize(["Docente","Director"]), deleteAnotacion)
  export default router;
