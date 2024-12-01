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
import docentesRoutes from "./docente.routes.js";
import encargado_labRoutes from "./encargado_lab.routes.js";
import directivoRoutes from "./directivo.routes.js";

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
    .use("/alumnos", alumnosRoutes)
    .use("/docentes", docentesRoutes)
    .use("/encargados_lab", encargado_labRoutes)
    .use("/directivos", directivoRoutes);

export default router;
