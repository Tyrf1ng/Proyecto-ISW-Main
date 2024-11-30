"use strict";
import { Router } from "express";
import {
    createEncargadoLab,
    deleteEncargadoLab,
    getEncargadoLabByRut,
    getEncargadosLab,
    updateEncargadoLab
} from "../controllers/encargado_lab.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

router
  .get("/", authorize(["EncargadoLab", "Directivo"]), getEncargadosLab)
  .get("/rut/:rut_encargado", authorize(["EncargadoLab", "Directivo"]), getEncargadoLabByRut)
  .post("/crear", authorize(["Directivo"]), createEncargadoLab)
  .put("/actualizar/:rut_encargado", authorize(["EncargadoLab", "Directivo"]), updateEncargadoLab)
  .delete("/borrar/:rut_encargado", authorize(["Directivo"]), deleteEncargadoLab);

export default router;
