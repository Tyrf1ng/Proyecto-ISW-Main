"use strict";
import Curso from "../entity/curso.entity.js";
import { AppDataSource } from "../config/configDb.js";
<<<<<<< HEAD

export async function getCursoService(query) {
  try {
    const { id, usuarioId, nombre } = query;

    const cursoRepository = AppDataSource.getRepository(Curso);

    const cursoFound = await cursoRepository.findOne({
      where: [{ id: id }, { usuarioId: usuarioId }, { nombre: nombre }],
    });

    if (!cursoFound) return [null, "Curso no encontrado"];

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
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createCursoService(body) {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);

    const nuevoCurso = cursoRepository.create({
      nombre: body.nombre,
      nivel: body.nivel,
      usuarioId: body.usuarioId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const cursoGuardado = await cursoRepository.save(nuevoCurso);

    return [cursoGuardado, null];
  } catch (error) {
    console.error("Error al crear el curso:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateCursoService(query, body) {
  try {
    const { id, usuarioId } = query;

    const cursoRepository = AppDataSource.getRepository(Curso);

    const cursoFound = await cursoRepository.findOne({
      where: [{ id: id }, { usuarioId: usuarioId }],
    });

    if (!cursoFound) return [null, "Curso no encontrado"];

    const dataCursoUpdate = {
      nombre: body.nombre,
      nivel: body.nivel,
      updatedAt: new Date(),
    };

    await cursoRepository.update({ id: cursoFound.id }, dataCursoUpdate);

    const cursoUpdated = await cursoRepository.findOne({ where: { id: cursoFound.id } });

    if (!cursoUpdated) {
      return [null, "Curso no encontrado después de actualizar"];
    }

    return [cursoUpdated, null];
  } catch (error) {
    console.error("Error al modificar un curso:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteCursoService(query) {
  try {
    const { id, usuarioId } = query;

    const cursoRepository = AppDataSource.getRepository(Curso);

    const cursoFound = await cursoRepository.findOne({
      where: [{ id: id }, { usuarioId: usuarioId }],
    });

    if (!cursoFound) return [null, "Curso no encontrado"];

    const cursoDeleted = await cursoRepository.remove(cursoFound);

    return [cursoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    return [null, "Error interno del servidor"];
  }
}
=======
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
>>>>>>> origin/main
