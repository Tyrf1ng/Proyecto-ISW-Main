"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import cursoRoutes from "./curso.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import anotacionRoutes from "./anotaciones.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/cursos", cursoRoutes)
    .use("/asistencias", asistenciaRoutes)
    .use("/anotaciones", anotacionRoutes);

export default router;
