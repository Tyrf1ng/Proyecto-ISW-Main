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
  .get("/", authorize([,"Docente","Director"]), getAlumnos ) 
  .get("/rut/:rut_alumno",authorize(["Docente","Director"]), getAlumnoByRut) 
  .get("/curso/:id_curso",authorize(["Docente","Director"]), getAlumnosByCurso) 
  .get("/buscar",authorize(["Docente","Director"]), getAlumnosByNombre) 
  .post("/crear",authorize(["Docente","Director"]), createAlumno) 
  .put("/actualizar/:rut_alumno",authorize(["Docente","Director"]), updateAlumno) 
  .delete("/borrar/:rut_alumno",authorize(["Docente","Director"]), deleteAlumno); 

export default router;
