"use strict";
import { Router } from "express";
import { 
    createAnotacion,
    deleteAnotacion,
    getAnotacionesPorCursoYAsignatura,
    getAnotacionesPorRutYAsignatura,
    updateAnotacion,
} from "../controllers/anotaciones.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .post("/crear/", authorize(["Docente", "Directivo"]), createAnotacion) 
  .put("/actualizar/:id_anotacion", authorize(["Docente", "Directivo"]), updateAnotacion) 
  .delete("/borrar/:id_anotacion", authorize(["Docente", "Directivo"]), deleteAnotacion) 
  .get(
    "/curso/:id_curso/asignatura/:id_asignatura",
    authorize(["Docente", "Directivo"]),
    getAnotacionesPorCursoYAsignatura)
  .get("/rut/:rut/asignatura/:id_asignatura", 
    authorize(["Docente", "Directivo", "Alumno"]), getAnotacionesPorRutYAsignatura);

export default router;
