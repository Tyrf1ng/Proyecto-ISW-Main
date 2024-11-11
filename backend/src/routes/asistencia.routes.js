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

const router = Router();

router
  .use(authenticateJwt)

router
    .get("/:id_asistencia", getAsistenciaController)
    .get("/alumno/:rut_alumno", getAsistenciasAlumnoController)
    .get("/asignatura/:id_asignatura", getAsistenciasAsignaturaController)
    .get("/curso/:id_curso", getAsistenciasCursoController)
    .patch("/actualizar/:id_asistencia", updateAsistenciaController)
    .delete("/borrar/:id_asistencia", deleteAsistenciaController)
    .post("/crear/", createAsistenciaController);

export default router;