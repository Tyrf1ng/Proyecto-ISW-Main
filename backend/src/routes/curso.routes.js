"use strict";
import { Router } from "express";
import { getCurso, getCursos } from "../controllers/curso.controller.js";

const router = Router();

router
    .get("/curso/", getCurso)
    .get("/cursos/", getCursos);

export default router;