"use strict";  
import { Router } from "express";
import {  
    createNotaController,
    deleteNotasController,
    getAllNotasController,
    getNotaController,
    getNotasAlumnoController, 
    getNotasAsignaturaController,
    getNotasCursoController,
    updateNotaController,
    
 } 
    from "../controllers/notas.controller.js";
import authorize from "../middlewares/authorization.middleware.js";

const router = Router();

router
    .get("/",authorize(["Directivo","Administrador"]), getAllNotasController)
    .get("/:id_nota",authorize(["Directivo","Administrador","Docente"]), getNotaController)
    .get("/alumno/:rut_alumno",authorize(["Directivo","Administrador","Docente","Alumno"]), getNotasAlumnoController)
    .get("/asignatura/:id_asignatura",authorize(["Directivo","Administrador","Docente"]), getNotasAsignaturaController)
    .get("/curso/:id_curso",authorize(["Directivo","Administrador","Docente"]), getNotasCursoController)
    .patch("/actualizar/:id_nota",authorize(["Directivo","Administrador","Docente"]), updateNotaController)
    .delete("/borrar/:id_nota",authorize(["Directivo","Administrador","Docente"]), deleteNotasController)
    .post("/crear/",authorize(["Directivo","Administrador","Docente"]), createNotaController);


export default router;