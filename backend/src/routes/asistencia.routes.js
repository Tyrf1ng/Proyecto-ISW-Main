"use strict";
import { Router } from "express";
import {
    getAsistenciasAlumnoFechaController,
    createAsistenciaController,
    updateAsistenciaController,
    deleteAsistenciaController,
    getAsistenciasPorCursoYAsignatura,
    getAsistenciasPorRutYAsignatura,
} from "../controllers/asistencia.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt);

router
router 
    // Ruta para acceder a las asistencias de un alumno en una fecha determinada
    .get("/alumno/:rut/asignatura/:id_asignatura/fecha/:fecha", authorize(["Docente", "Alumno", "Directivo"]), getAsistenciasAlumnoFechaController)
    // Ruta para crear una asistencia
    .post("/crear", authorize(["Docente", "Directivo"]), createAsistenciaController)
    // Ruta para actualizar una asistencia
    .patch("/actualizar/:id_asistencia", authorize(["Docente"]), updateAsistenciaController)
    // Ruta para eliminar una asistencia
    .delete("/borrar/:id_asistencia", authorize(["Docente", "Directivo"]), deleteAsistenciaController)
    // Ruta para obtener las asistencias de un curso y asignatura se utiliza para las asistencias desde la vista del profesor
    .get("/curso/:id_curso/asignatura/:id_asignatura", authorize(["Docente", "Directivo"]), getAsistenciasPorCursoYAsignatura)
    // Ruta para obtener las asistencias de un alumno por asignatura se utiliza para las asistencias desde la vista del alumno
    .get("/rut/:rut/asignatura/:id_asignatura", authorize(["Docente", "Directivo", "Alumno"]), getAsistenciasPorRutYAsignatura);

export default router;