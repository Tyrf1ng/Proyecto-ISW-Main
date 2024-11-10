"use strict";
import { In } from "typeorm";
import Cursos from "../entity/curso.entity.js";
import { AppDataSource } from "../config/configDb.js";

//funcion para traer todos los cursos
export async function getCursos() {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const cursos = await cursoRepository.find();
        if (!cursos || cursos.length === 0) return [null, "No hay cursos"];
        const cursosData = cursos.map(({ ...curso }) => curso);
        return [cursosData, null];
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para traer un curso por id
export async function getCurso(id_curso) {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const curso = await cursoRepository.findOne({
            where: { id_curso: id_curso }
        });
        if (!curso) {
            return [null, "Curso no encontrado"];
        }
        return [curso, null];
    } catch (error) {
        console.error("Error al obtener el curso:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para crear un curso
export async function createCurso(curso) {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const cursoCreado = await cursoRepository.save(curso);
        return [cursoCreado, null];
    } catch (error) {
        console.error("Error al crear el curso:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para actualizar un curso
export async function updateCurso(id, curso) {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const cursoActualizado = await cursoRepository.update(id, curso);
        if (!cursoActualizado.affected) return [null, "Curso no encontrado"];
        return [cursoActualizado, null];
    } catch (error) {
        console.error("Error al actualizar el curso:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para eliminar un curso
export async function deleteCurso(id) {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const cursoEliminado = await cursoRepository.delete(id);
        if (!cursoEliminado.affected) return [null, "Curso no encontrado"];
        return [cursoEliminado, null];
    } catch (error) {
        console.error("Error al eliminar el curso:", error);
        return [null, "Error interno del servidor"];
    }
}
