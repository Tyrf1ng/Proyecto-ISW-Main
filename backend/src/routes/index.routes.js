"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
<<<<<<< HEAD
import cursoRoutes from "./curso.routes.js";  // <-- Importar las rutas de cursos
=======
import cursoRoutes from "./curso.routes.js";
>>>>>>> origin/main

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
<<<<<<< HEAD
    .use("/cursos", cursoRoutes);  // <-- Añadir las rutas de cursos

=======
    .use("/cursos", cursoRoutes);
>>>>>>> origin/main
export default router;
