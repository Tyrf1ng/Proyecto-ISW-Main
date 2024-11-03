"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cursoRoutes from "./curso.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import anotacionRoutes from "./anotaciones.routes.js";
import notasRoutes from "./notas.routes.js";
import labRoutes from "./lab.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/cursos", cursoRoutes)
    .use("/asistencias", asistenciaRoutes)
    .use("/anotaciones", anotacionRoutes)
    .use("/notas", notasRoutes)
    .use("/labs", labRoutes);

export default router;
