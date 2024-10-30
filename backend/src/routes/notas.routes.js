"use strict";  
import { Router } from "express";
import {  
    createNotaController,
    deleteNotasController,
    getNotaController,
    getNotasAlumnoController, 
    getNotasAsignaturaController,
    getNotasCursoController,
    updateNotaController,
    
 } 
    from "../controllers/notas.controller.js";

const router = Router();

router
    .get("/:id_nota", getNotaController)
    .get("/alumno/:rut_alumno", getNotasAlumnoController)
    .get("/asignatura/:id_asignatura", getNotasAsignaturaController)
    .get("/curso/:id_curso", getNotasCursoController)
    .patch("/:id_nota", updateNotaController)
    .delete("/borrar/:id_nota", deleteNotasController)
    .post("/crear/", createNotaController);


export default router;