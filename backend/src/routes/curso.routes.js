"use strict";
import { Router } from "express";
import {
    //createCurso,
    //deleteCurso,
    getCursoController,
    getCursosController,
    //updateCurso,
  } from "../controllers/curso.controller.js"
const router = Router();

// Ruta para obtener un curso (por id, nombre o nivel)
router
  .get("/", getCursosController)           // Obtener todos los cursos
  .get("/detail/", getCursoController);     // Obtener un curso específico
export default router;
