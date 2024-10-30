"use strict";
import { Router } from "express";
import {
    createLab,
    deleteLab,
    getLab,
    getLabs,
    updateLab,
  } from "../controllers/lab.controller.js"
const router = Router();

router
    .get("/", getLabs)         
    .get("/:id_lab", getLab)
    .patch("/update/:id_lab", updateLab)
    .delete("/delete/:id_lab", deleteLab) 
    .post("/create", createLab);
export default router;