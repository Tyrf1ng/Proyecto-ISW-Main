import { Router } from "express";
import { getAsignaturasByAlumnoController, 
    getAsignaturasByProfesorController
     } from "../controllers/asignatura.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .get("/profesor/:rut_docente", authorize(["Docente", "Directivo"]), getAsignaturasByProfesorController)
    .get("/alumno/:rut_alumno", authorize(["Alumno"]), getAsignaturasByAlumnoController);

    export default router;
