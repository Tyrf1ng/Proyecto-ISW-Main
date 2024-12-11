"use strict";
import { In } from "typeorm";
import Cursos from "../entity/curso.entity.js";
import { AppDataSource } from "../config/configDb.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";
import AsignaturasSchema from "../entity/asignatura.entity.js";
import Usuario from "../entity/usuario.entity.js"; 
import Conect_Usuario_CursoSchema from "..//entity/conect_usuario_curso.entity.js";


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

export async function updateCurso(id_curso, curso) {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const cursoActualizado = await cursoRepository.update(id_curso, curso);
        if (!cursoActualizado.affected) return [null, "Curso no encontrado"];
        return [cursoActualizado, null];
    } catch (error) {
        console.error("Error al actualizar el curso:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteCurso(id_curso) {
    try {
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const cursoEliminado = await cursoRepository.delete(id_curso);
        if (!cursoEliminado.affected) return [null, "Curso no encontrado"];
        return [cursoEliminado, null];
    } catch (error) {
        console.error("Error al eliminar el curso:", error);
        return [null, "Error interno del servidor"];
    }
}



export async function getCursosByProfesor(rut) {
    try {
        const AsignaturaRepository = AppDataSource.getRepository(AsignaturasSchema);
        const AsignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);
        const cursoRepository = AppDataSource.getRepository(Cursos);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const usuario = await usuarioRepository.findOne({
            where: { rut: rut, id_roles: 2 } 
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de profesor para este rut"];
        }

      
        const asignaturasDelDocente = await AsignaturaRepository.find({
            where: { rut: rut } 
        });

        const idsAsignaturas = asignaturasDelDocente.map(asignatura => asignatura.id_asignatura);

        if (idsAsignaturas.length === 0) {
            return [null, "No hay asignaturas para este profesor"];
        }

        const cursosAsociados = await AsignaturaCursoRepository.find({
            where: { id_asignatura: In(idsAsignaturas) }
        });

        const idsCursos = cursosAsociados.map(ac => ac.id_curso);

        if (idsCursos.length === 0) {
            return [null, "No hay cursos asociados a las asignaturas de este profesor"];
        }

        const cursos = await cursoRepository.find({
            where: {
                id_curso: In(idsCursos)
            }
        });

        if (!cursos || cursos.length === 0) {
            return [null, "No hay cursos para este profesor"];
        }

        return [cursos, "Cursos encontrados"];
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAlumnosPorCurso(id_curso) {
    try {
        const conectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_CursoSchema);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const relaciones = await conectUsuarioCursoRepository.find({ where: { id_curso } });

        if (!relaciones || relaciones.length === 0) {
            return [null, "No hay alumnos en este curso"];
        }

        const ruts = relaciones.map(relacion => relacion.rut);
        const alumnos = await usuarioRepository.find({ where: { rut: In(ruts) } });

        return [alumnos, null];
    } catch (error) {
        console.error("Error al obtener los alumnos del curso:", error);
        return [null, "Error interno del servidor"];
    }
}