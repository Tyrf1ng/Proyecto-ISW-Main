"use strict";
import { Router } from "express";
import {
    createAlumno,
    deleteAlumno,
    getAlumnoByRut,
    getAlumnos,
    getAlumnosByCurso,
    getAlumnosByNombre,
    updateAlumno
} from "../controllers/alumnos.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", authorize(["Docente", "Directivo"]), getAlumnos) // Cambié "Director" por "Directivo"
  .get("/rut/:rut_alumno", authorize(["Docente", "Directivo"]), getAlumnoByRut) // Cambié "Director" por "Directivo"
  .get("/curso/:id_curso", authorize(["Docente", "Directivo"]), getAlumnosByCurso) // Cambié "Director" por "Directivo"
  .get("/buscar", authorize(["Docente", "Directivo"]), getAlumnosByNombre) // Cambié "Director" por "Directivo"
  .post("/crear", authorize(["Docente", "Directivo"]), createAlumno) // Cambié "Director" por "Directivo"
  .put("/actualizar/:rut_alumno", authorize(["Docente", "Directivo"]), updateAlumno) 
  .delete("/borrar/:rut_alumno", authorize(["Docente", "Directivo"]), deleteAlumno);

export default router;
