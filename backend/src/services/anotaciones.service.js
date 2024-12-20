"use strict";
import { In } from "typeorm";
import Anotaciones from "../entity/anotacion.entity.js";
import Usuario from "../entity/usuario.entity.js";
import Conect_Usuario_CursoSchema from "../entity/conect_usuario_curso.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createAnotacionService(data) {
    try {
        const { descripcion, tipo, id_asignatura, rut } = data;
        const UsuarioRepository = AppDataSource.getRepository(Usuario);

        const alumno = await UsuarioRepository.findOne({
            where: { rut, id_roles: 3 },
        });

        if (!alumno) {
            return [null, "El usuario no es un alumno o no existe"];
        }

        const currentDate = new Date();
        const day = currentDate.getDay(); 
        const hour = currentDate.getHours(); 

        if (day === 0 || day === 6) {
            return [null, "No se puede crear una anotación en sábado o domingo."];
        }
        if (hour < 8 || hour >= 18) {
            return [null, "La hora para crear una anotación debe estar entre las 8 AM y las 6 PM."];
        }

        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const newAnotacion = AnotacionRepository.create({
            descripcion,
            tipo,
            id_asignatura,
            rut,
        });
        await AnotacionRepository.save(newAnotacion);
        return [newAnotacion, null];
    } catch (error) {
        console.error("Error al crear la anotación:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateAnotacionService(id_anotacion, datosActualizados) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);

        const AnotacionFound = await AnotacionRepository.findOne({
            where: { id_anotacion: parseInt(id_anotacion, 10) },
        });

        if (!AnotacionFound) {
            console.error(`Anotación con ID ${id_anotacion} no encontrada`);
            return [null, "Anotación no encontrada"];
        }

        if (datosActualizados.id_asignatura) {
            datosActualizados.id_asignatura = parseInt(datosActualizados.id_asignatura, 10);
        }

        AnotacionRepository.merge(AnotacionFound, datosActualizados);
        await AnotacionRepository.save(AnotacionFound);

        return [AnotacionFound, null];
    } catch (error) {
        console.error("Error al actualizar la anotación:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteAnotacionService(id_anotacion) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const AnotacionFound = await AnotacionRepository.findOne({
            where: { id_anotacion: parseInt(id_anotacion, 10) },
        });

        if (!AnotacionFound) {
            console.error(`Anotación con ID ${id_anotacion} no encontrada`);
            return [null, "Anotación no encontrada"];
        }

        await AnotacionRepository.remove(AnotacionFound);
        return [AnotacionFound, null];
    } catch (error) {
        console.error("Error específico al eliminar la anotación:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAnotacionesPorCursoYAsignaturaService(id_curso, id_asignatura) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const ConectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_CursoSchema);
        
        const relacionesCurso = await ConectUsuarioCursoRepository.find({
            where: { id_curso },
        });

        if (!relacionesCurso || relacionesCurso.length === 0) {
            return [[], "No hay alumnos asociados a este curso"];
        }

        const rutsAlumnos = relacionesCurso.map(relacion => relacion.rut);

        const anotaciones = await AnotacionRepository.find({
            where: {
                rut: In(rutsAlumnos),
                id_asignatura,
            },
        });
        return [anotaciones, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones por curso y asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function getAnotacionesPorRutYAsignaturaService(rut, id_asignatura) {
    try {
        if (!rut || !id_asignatura) {
            return [[], "RUT y ID de asignatura son requeridos"];
        }

        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const alumno = await UsuarioRepository.findOne({
            where: { rut: rut, id_roles: 3 },
        });

        if (!alumno) {
            console.error(`Usuario con RUT ${rut} no encontrado o no tiene el rol 3`);
            return [[], "Usuario no es un alumno válido"];
        }

        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const anotaciones = await AnotacionRepository.find({
            where: { rut, id_asignatura },
            order: { createdAt: "DESC" },
        });

        if (!anotaciones || anotaciones.length === 0) {
            return [[], null];
        }

        return [anotaciones, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones por RUT y asignatura:", error);
        return [[], "Error interno del servidor"];
    }
}
