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
    getAsistenciasAlumnoFechaController,
    getAsistenciasAlumnoAsignaturaController
} from "../controllers/asistencia.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt);

router
router
    .get("/alumno/:rut/asignatura/:id_asignatura", authorize(["Alumno"]), getAsistenciasAlumnoAsignaturaController)
    .get("/:id_asistencia", authorize(["Docente", "Directivo"]), getAsistenciaController)
    .get("/alumno/:rut", authorize(["Docente", "Alumno", "Directivo"]), getAsistenciasAlumnoController)
    .get("/alumno/:rut/asignatura/:id_asignatura/fecha/:fecha", authorize(["Docente", "Alumno", "Directivo"]), getAsistenciasAlumnoFechaController)
    .get("/asignatura/:id_asignatura/curso/:id_curso", authorize(["Docente", "Directivo"]), getAsistenciasAsignaturaController)
    .get("/curso/:id_curso", authorize(["Docente", "Directivo","Alumno"]), getAsistenciasCursoController)
    .patch("/actualizar/:id_asistencia", authorize(["Docente"]), updateAsistenciaController)
    .delete("/borrar/:id_asistencia", authorize(["Docente", "Directivo"]), deleteAsistenciaController)
    .post("/crear", authorize(["Docente", "Directivo"]), createAsistenciaController);

export default router;