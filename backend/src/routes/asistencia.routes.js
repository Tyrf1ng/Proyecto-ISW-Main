
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import {
  createAsistencia,
  deleteAsistencia,
  getAllAsistencias,
  getAsistenciaById,
  updateAsistencia,
} from "../controllers/asistencia.controller.js";

const router = Router();

router
    .use(authenticateJwt)
    .use(isAdmin);

router
    .get("/", getAllAsistencias)
    .get("/:id", getAsistenciaById)
    .post("/", createAsistencia)
    .put("/:id", updateAsistencia)
    .delete("/:id", deleteAsistencia);

export default router;
