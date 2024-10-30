"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cursoRoutes from "./curso.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
<<<<<<< HEAD
import labRoutes from "./lab.routes.js";
=======
import anotacionRoutes from "./anotaciones.routes.js";
import notasRoutes from "./notas.routes.js";
>>>>>>> main

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/cursos", cursoRoutes)
    .use("/asistencias", asistenciaRoutes)
<<<<<<< HEAD
    .use("/labs", labRoutes);
=======
    .use("/anotaciones", anotacionRoutes)
    .use("/notas", notasRoutes)
    .use("/asistencias", asistenciaRoutes);

>>>>>>> main
export default router;
