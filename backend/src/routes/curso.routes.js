"use strict";
import { Router } from "express";
import {
    createCursoController,
    deleteCursoController,
    getCursoController,
    getCursosByProfesorController,
    getCursosController,
    updateCursoController,
} from "../controllers/curso.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)

router
    .get("/:id_curso", getCursoController)
    .get("/", getCursosController)
    .get("/profesor/:rut_docente",authorize(["Docente","Directivo","Administrador"]), getCursosByProfesorController)
    .post("/crear/",authorize(["Administrador","Directivo","Administrador"]), createCursoController)
    .patch("/actualizar/:id_curso",authorize(["Directivo","Administrador"]), updateCursoController)
    .delete("/borrar/:id_curso",authorize(["Directivo","Administrador"]), deleteCursoController);

export default router;