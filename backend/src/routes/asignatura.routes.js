import { Router } from "express";
import { getAsignaturasByAlumnoController, 
    getAsignaturasByProfesorController
     } from "../controllers/asignatura.controller.js";
import { getNombreAsignaturaByIdController } from "../controllers/asignatura.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .use(authenticateJwt)
    .get("/profesor/:rut", authorize(["Docente", "Directivo", "Encargado de Laboratorio"]), getAsignaturasByProfesorController)
    .get("/alumno/:rut", authorize(["Alumno"]), getAsignaturasByAlumnoController)
    .get("/nombre/:id_asignatura", authorize(["Docente", "Directivo", "Encargado de Laboratorio"]), getNombreAsignaturaByIdController)
export default router;
