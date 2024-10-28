"use strict";
import { Router } from "express";
import { getAnotacion,
         getAnotaciones } from "../controllers/anotaciones.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
  .use(authenticateJwt)

router
  .get("/", getAnotaciones)         
  .get("/detail/", getAnotacion);  
export default router;
