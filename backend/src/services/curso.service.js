"use strict";
import Curso from "../entity/curso.entity.js";
import { AppDataSource } from "../config/configDb.js";
export async function getCursoService(query) {
    try {
        const { id_Curso, nombreCurso, nivel, rutDocente } = query;
    
        const cursoRepository = AppDataSource.getRepository(Curso);
    
        const cursoFound = await cursoRepository.findOne({
        where: [{ id_Curso: id_Curso }, { nombreCurso: nombreCurso }, { nivel: nivel }, { rutDocente: rutDocente }],
        });
    
        if (!cursoFound) return [null, "Curso no encontrado"];
        console.log(cursoFound);
        return [cursoFound, null];
    } catch (error) {
        console.error("Error al obtener el curso:", error);
        return [null, "Error interno del servidor"];
    }
    }
export async function getCursosService() {
    try {
        const cursoRepository = AppDataSource.getRepository(Curso);
        const cursos = await cursoRepository.find();
        if (!cursos || cursos.length === 0) return [null, "No hay cursos"];
        
        return [cursos, null];
        console.log(cursos);
    } catch (error) {   
        console.error("Error al obtener los cursos:", error);
        return [null, "Error interno del servidor"];
    }
}