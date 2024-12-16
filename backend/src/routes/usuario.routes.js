"use strict";
import { Router } from "express";
import {
    createUsuario,
    deleteUsuario,
    getAlumnosPorCurso,
    getUsuarioByRut,
    getUsuarios,
    getUsuariosByNombre,
    updateUsuario,
    getRutsDocentes 
} from "../controllers/usuario.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
  .use(authenticateJwt);

router
  .get("/", authorize(["Directivo","Docente"]), getUsuarios) 
  .get("/rut/:rut", authorize(["Directivo", "Docente", "Encargado de Laboratorio", "Alumno"]), getUsuarioByRut) 
  .get("/alumnoscurso/:id_Curso", authorize(["Directivo", "Docente"]), getAlumnosPorCurso) 
  .get("/buscar", authorize(["Directivo"]), getUsuariosByNombre) 
  .get("/docentes/ruts", authorize(["Directivo", "Docente", "Encargado de Laboratorio"]), getRutsDocentes) 
  .post("/crear", authorize(["Directivo"]), createUsuario) 
  .put("/actualizar/:rut", authorize(["Directivo"]), updateUsuario)
  .delete("/borrar/:rut", authorize(["Directivo"]), deleteUsuario);

export default router;