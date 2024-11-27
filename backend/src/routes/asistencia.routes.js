"use strict";  
import { Router } from "express";
import {  
    createAsistenciaController,
    deleteAsistenciaController,
    getAsistenciaController,
    getAsistenciasAlumnoController, 
    getAsistenciasAsignaturaController,
    getAsistenciasCursoController,
    updateAsistenciaController,
} from "../controllers/asistencia.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
    .get("/:id_asistencia",authorize(["Docente","Director"]), getAsistenciaController)
    .get("/alumno/:rut_alumno",authorize(["Docente","Alumno","Director"]), getAsistenciasAlumnoController)
    .get("/asignatura/:id_asignatura",authorize(["Docente","Director"]), getAsistenciasAsignaturaController)
    .get("/curso/:id_curso",authorize(["Docente","Director"]), getAsistenciasCursoController)
    .patch("/actualizar/:id_asistencia",authorize(["Docente"]), updateAsistenciaController)
    .delete("/borrar/:id_asistencia",authorize(["Docente","Director"]), deleteAsistenciaController)
    .post("/crear/",authorize(["Docente","Director"]), createAsistenciaController);

export default router;