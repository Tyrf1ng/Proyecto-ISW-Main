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

    // Configuración de CORS para permitir solicitudes desde localhost:3000 y 146.83.198.35:1287
    const corsOptions = {
      credentials: true, // Habilitar el uso de cookies (si las usas)
      origin: (origin, callback) => {
        // Aquí solo permitimos las solicitudes desde los orígenes específicos
        const allowedOrigins = [
          'http://localhost:5173',
          'http://146.83.198.35:1288'
        ];

        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true); // Permite solicitudes desde los orígenes listados
        } else {
          callback(new Error('No permitido por CORS')); // Bloquea los demás orígenes
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Cabeceras permitidas
    };

    // Aplicamos la configuración de CORS a nuestra aplicación
    app.use(cors(corsOptions));

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
          secure: false, // Si estás usando HTTPS, cambia esto a true
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
