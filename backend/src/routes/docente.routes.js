"use strict";
import { Router } from "express";
import { 
    createDocente,
    deleteDocente,
    getDocenteByRut,
    getDocentes,
    getDocentesByNombre,
    updateDocente
} from "../controllers/docente.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplica autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas protegidas por roles "Docente" y "Directivo"
router
  .get("/", authorize(["Docente", "Directivo"]), getDocentes) // Cambié "Director" por "Directivo"
  .get("/rut/:rut_docente", authorize(["Docente", "Directivo"]), getDocenteByRut) // Cambié "Director" por "Directivo"
  .get("/buscar", authorize(["Docente", "Directivo"]), getDocentesByNombre) // Cambié "Director" por "Directivo"
  .post("/crear", authorize(["Docente", "Directivo"]), createDocente) // Cambié "Director" por "Directivo"
  .put("/actualizar/:rut_docente", authorize(["Docente", "Directivo"]), updateDocente) 
  .delete("/borrar/:rut_docente", authorize(["Docente", "Directivo"]), deleteDocente) 
export default router;
