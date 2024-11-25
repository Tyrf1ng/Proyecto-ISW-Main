"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import {
  createAdministrativos,
  createAlumnos,
  createAnotaciones,
  createApoderado,
  createAsignaturaCurso,
  createAsignaturas,
  createAsistencia,
  createConex_Adminis_Ficha,
  createConex_Encargado_Horario,
  createConex_Lab_Encargado,
  createCursoDirectivos,
  createCursos,
  createDirectivos,
  createDocente,
  createEncargados_Lab,
  createFicha_Estudiante,
  createHorarios,
  createLabs,
  createNotas,
  createObservaciones,
  createReserva,
  createRoles,
} from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      })
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      })
    );

    app.use(
      json({
        limit: "1mb",
      })
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passportJwtSetup();

    app.use("/api", indexRoutes); // Rutas principales
    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
    await createRoles();
    await createDirectivos();
    await createCursos();
    await createCursoDirectivos();
    await createDocente();
    await createAsignaturas();
    await createAsignaturaCurso();
    await createApoderado();
    await createAlumnos();
    await createAnotaciones();
    await createAsistencia();
    await createNotas();
    await createAdministrativos();
    await createFicha_Estudiante();
    await createConex_Adminis_Ficha();
    await createObservaciones();
    await createEncargados_Lab();
    await createLabs();
    await createConex_Lab_Encargado();
    await createHorarios();
    await createConex_Encargado_Horario();
    await createReserva();
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error)
  );
