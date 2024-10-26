"use strict";
import { Router } from "express";
import {
    getCurso,
    getCursos,
  } from "../controllers/curso.controller.js"
const router = Router();

router
  .get("/", getCursos)         
  .get("/detail/", getCurso);  
export default router;
