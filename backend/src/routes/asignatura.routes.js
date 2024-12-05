import { Router } from "express";
import { getAsignaturasByProfesorController } from "../controllers/asignatura.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .get("/profesor/:rut_docente", authorize(["Docente", "Directivo"]), getAsignaturasByProfesorController);

export default router;
