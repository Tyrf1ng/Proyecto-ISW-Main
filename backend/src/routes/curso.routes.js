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

const router = Router();

router
    .use(authenticateJwt)

router
    .get("/:id_curso", getCursoController)
    .get("/", getCursosController)
    .get("/profesor/:id_curso", getCursosByProfesorController)
    .post("/crear/", createCursoController)
    .patch("/actualizar/:id_curso", updateCursoController)
    .delete("/borrar/:id_curso", deleteCursoController);

export default router;