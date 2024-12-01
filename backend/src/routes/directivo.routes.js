"use strict";
import { Router } from "express";
import { 
    createDirectivo,
    deleteDirectivo,
    getDirectivoByRut,
    getDirectivos,
    updateDirectivo
} from "../controllers/directivo.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

// Aplica autenticación a todas las rutas
router.use(authenticateJwt);

// Rutas protegidas por rol "Directivo"
router
  .get("/", authorize(["Directivo"]), getDirectivos)
  .get("/rut/:rut_directivo", authorize(["Directivo"]), getDirectivoByRut)
  .post("/crear", authorize(["Directivo"]), createDirectivo)
  .put("/actualizar/:rut_directivo", authorize(["Directivo"]), updateDirectivo)
  .delete("/borrar/:rut_directivo", authorize(["Directivo"]), deleteDirectivo);

export default router;
