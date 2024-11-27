"use strict";
import authorize from "../middlewares/authorization.middleware.js";
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

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", authorize(["Alumno","Docente"]), getAlumnos ) // Obtener todos los alumnos
  .get("/rut/:rut_alumno", getAlumnoByRut) // Obtener un alumno por RUT
  .get("/curso/:id_curso", getAlumnosByCurso) // Obtener alumnos de un curso
  .get("/buscar", getAlumnosByNombre) // Buscar alumnos por nombre (y opcionalmente curso)
  .post("/crear", createAlumno) // Crear un nuevo alumno
  .put("/actualizar/:rut_alumno", updateAlumno) // Actualizar un alumno por RUT
  .delete("/borrar/:rut_alumno", deleteAlumno); // Eliminar un alumno por RUT

export default router;
