"use strict";  
import { Router } from "express";
import {  
    createNotaController,
    deleteNotasController,
    getNotasAlumnoAsignaturaController,
    getNotasAsignaturaController,
    getNotasCursoController,
    updateNotaController,
    
 } 
    from "../controllers/notas.controller.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .get("/asignatura/:id_asignatura/alumno/:rut",authorize(["Alumno"]), getNotasAlumnoAsignaturaController)
    .get("/asignatura/:id_asignatura",authorize(["Directivo","Docente"]), getNotasAsignaturaController)
    .get("/curso/:id_curso",authorize(["Directivo","Docente"]), getNotasCursoController)
    .patch("/actualizar/:id_nota",authorize(["Docente"]), updateNotaController)
    .delete("/borrar/:id_nota",authorize(["Docente"]), deleteNotasController)
    .post("/crear/",authorize(["Docente"]), createNotaController);


export default router;