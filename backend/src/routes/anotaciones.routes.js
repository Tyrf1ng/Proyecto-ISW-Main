"use strict";
import { Router } from "express";
import { 
    createAnotacion,
    deleteAnotacion,
    getAnotacion,
    getAnotaciones,
    getAnotacionesAlumno,
    getAnotacionesAsignatura,
    getAnotacionesCurso,
    updateAnotacion 
} from "../controllers/anotaciones.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .get("/", authorize(["Docente", "Directivo"]), getAnotaciones) 
  .get("/anotacion/:id_anotacion", authorize(["Docente", "Directivo"]), getAnotacion) 
  .get("/asignatura/:id_asignatura", authorize(["Docente", "Directivo"]), getAnotacionesAsignatura) 
  .get("/alumno/:rut", authorize(["Alumno", "Directivo", "Docente"]), getAnotacionesAlumno) 
  .get("/curso/:id_curso", authorize(["Docente", "Directivo"]), getAnotacionesCurso) 
  .post("/crear/", authorize(["Docente", "Directivo"]), createAnotacion) 
  .put("/actualizar/:id_anotacion", authorize(["Docente", "Directivo"]), updateAnotacion) 
  .delete("/borrar/:id_anotacion", authorize(["Docente", "Directivo"]), deleteAnotacion) 

export default router;
