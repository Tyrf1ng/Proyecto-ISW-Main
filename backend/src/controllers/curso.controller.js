"use strict";
import {
 // deleteUserService,
  getCursoService,
  getCursosService,
  //updateUserService,
} from "../services/curso.service.js";



export async function getCursoController(req, res) {
  try {
    const query = req.query;
    const [curso, error] = await getCursoService(query);
    
    if (error) {
      return res.status(404).json({ message: error });
    }
    
    return res.status(200).json(curso);
  } catch (error) {
    console.error("Error en getCursoController:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener todos los cursos
export async function getCursosController(req, res) {
  try {
    const [cursos, error] = await getCursosService();
    
    if (error) {
      return res.status(404).json({ message: error });
    }
    
    return res.status(200).json(cursos);
  } catch (error) {
    console.error("Error en getCursosController:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
