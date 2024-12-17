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
    getAnotacionesPorRutYAsignatura,
    updateAnotacion,
    getAnotacionesPorCursoYAsignatura
} from "../controllers/anotaciones.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .get("/", authorize(["Docente", ]), getAnotaciones) 
  .get("/anotacion/:id_anotacion", authorize(["Docente"]), getAnotacion) 
  .get("/asignatura/:id_asignatura", authorize(["Docente"]), getAnotacionesAsignatura) 
  .get("/alumno/:rut", authorize(["Alumno", "Docente"]), getAnotacionesAlumno) 
  .get("/curso/:id_curso", authorize(["Docente"]), getAnotacionesCurso) 
  .post("/crear/", authorize(["Docente"]), createAnotacion) 
  .put("/actualizar/:id_anotacion", authorize(["Docente"]), updateAnotacion) 
  .delete("/borrar/:id_anotacion", authorize(["Docente"]), deleteAnotacion) 
  .get(
    "/curso/:id_curso/asignatura/:id_asignatura",
    authorize(["Docente"]),
    getAnotacionesPorCursoYAsignatura
)
  .get("/rut/:rut/asignatura/:id_asignatura", authorize(["Docente", "Alumno"]), getAnotacionesPorRutYAsignatura);

export default router;
