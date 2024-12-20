"use strict";
import { Router } from "express";
import {
    createCursoController,
    deleteCursoController,
    getCursoController,
    getCursosByProfesorController,
    getAlumnosPorCursoController,
    getCursosController,
    updateCursoController,
    createConectUsuarioCursoController
} from "../controllers/curso.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router
    .get("/:id_curso", getCursoController)
    .get("/", getCursosController)
    .get("/alumnos/:id_curso", authorize(["Docente","Directivo"]), getAlumnosPorCursoController)
    .get("/profesor/:rut", authorize(["Docente","Directivo", "Encargado de Laboratorio"]), getCursosByProfesorController)
    .post("/crear/", authorize(["Directivo"]), createCursoController)
    .patch("/actualizar/:id_curso", authorize(["Directivo"]), updateCursoController)
    .delete("/borrar/:id_curso", authorize(["Directivo"]), deleteCursoController)
    .post("/conectar", authorize(["Directivo"]), createConectUsuarioCursoController);

export default router;
