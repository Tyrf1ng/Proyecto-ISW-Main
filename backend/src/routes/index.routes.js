"use strict";
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cursoRoutes from "./curso.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import anotacionRoutes from "./anotaciones.routes.js";
import notasRoutes from "./notas.routes.js";
import labRoutes from "./lab.routes.js";
import horariosRoutes from "./horarios.routes.js";
import reservaRoutes from "./reserva.routes.js";
import alumnosRoutes from "./alumnos.routes.js";

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/cursos", cursoRoutes)
    .use("/asistencias", asistenciaRoutes)
    .use("/anotaciones", anotacionRoutes)
    .use("/notas", notasRoutes)
    .use("/asistencias", asistenciaRoutes)
    .use("/labs", labRoutes)
    .use("/horarios", horariosRoutes)
    .use("/reserva", reservaRoutes)
    .use("/alumnos", alumnosRoutes);

export default router;
