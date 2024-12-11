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
  createAnotaciones,
  createAsignaturaCurso,
  createAsignaturas,
  createAsistencia,
  createConectUsuarioCurso,
  createCursos,
  createHorarios,
  createLabs,
  createNotas,
  createReserva,
  createRoles,
  createUsuario
} from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";

async function setupServer() {
  try {
    const app = express();
    app.disable("x-powered-by");

    const corsOptions = {
      credentials: true,
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:5173",
          "http://146.83.198.35:1288"
        ];
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("No permitido por CORS"));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos HTTP permitidos
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Cabeceras permitidas
    };

    app.use(cors(corsOptions));
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(session({
      secret: cookieKey,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();
    app.use("/api", indexRoutes);

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
    await createUsuario();
    await createCursos();
    await createConectUsuarioCurso();
    await createAsignaturas();
    await createAsignaturaCurso();
    await createAnotaciones();
    await createAsistencia();
    await createNotas();
    await createLabs();
    await createHorarios();
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
