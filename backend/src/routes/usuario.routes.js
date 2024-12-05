"use strict";
import { Router } from "express";
import {
    createUsuario,
    deleteUsuario,
    getAlumnosPorCurso,
    getUsuarioByRut,
    getUsuarios,
    getUsuariosByNombre,
    updateUsuario
} from "../controllers/usuario.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt);

// Rutas de usuarios
router
  .get("/", authorize(["Directivo"]), getUsuarios) // Cambié "Docente" por "Admin" y "Directivo"
  .get("/rut/:rut", authorize(["Directivo", "Docente"]), getUsuarioByRut) // Cambié "Docente" por "Admin" y "Directivo"
  .get("/alumnoscurso/:id_Curso", authorize(["Directivo", "Docente"]), getAlumnosPorCurso) 
  .get("/buscar", authorize(["Directivo"]), getUsuariosByNombre) // Cambié "Docente" por "Admin" y "Directivo"
  .post("/crear", authorize(["Directivo"]), createUsuario) // Cambié "Docente" por "Admin" y "Directivo"
  .put("/actualizar/:rut", authorize(["Directivo"]), updateUsuario)
  .delete("/borrar/:rut", authorize(["Directivo"]), deleteUsuario);

export default router;
