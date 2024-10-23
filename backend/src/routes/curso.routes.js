"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  createCurso,
  deleteCurso,
  getCurso,
  getCursos,
  updateCurso,
} from "../controllers/curso.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/", getCursos)           // Obtener todos los cursos
  .get("/detail/", getCurso)      // Obtener un curso específico
  .post("/detail/", createCurso)  // Crear un nuevo curso
  .patch("/detail/", updateCurso) // Actualizar un curso existente
  .delete("/detail/", deleteCurso); // Eliminar un curso específico

export default router;
