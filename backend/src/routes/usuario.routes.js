"use strict";
import { Router } from "express";
import {
    createUsuario,
    deleteUsuario,
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
  .get("/", authorize(["Admin", "Directivo"]), getUsuarios) // Cambié "Docente" por "Admin" y "Directivo"
  .get("/rut/:rut", authorize(["Admin", "Directivo"]), getUsuarioByRut) // Cambié "Docente" por "Admin" y "Directivo"
  .get("/buscar", authorize(["Admin", "Directivo"]), getUsuariosByNombre) // Cambié "Docente" por "Admin" y "Directivo"
  .post("/crear", authorize(["Admin", "Directivo"]), createUsuario) // Cambié "Docente" por "Admin" y "Directivo"
  .put("/actualizar/:rut", authorize(["Admin", "Directivo"]), updateUsuario)
  .delete("/borrar/:rut", authorize(["Admin", "Directivo"]), deleteUsuario);

export default router;
