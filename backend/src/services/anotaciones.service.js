"use strict";
import { In } from "typeorm";
import Anotaciones from "../entity/anotacion.entity.js";
import Usuario from "../entity/usuario.entity.js";
import CursoSchema from "../entity/curso.entity.js";
import Conect_Alumno_CursoSchema from "../entity/conect_alumno_curso.entity.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";
import { AppDataSource } from "../config/configDb.js";


export async function getAnotacionService(id_anotacion) {
    try {
        const id = parseInt(id_anotacion, 10);
        if (isNaN(id)) {
            console.error("El ID de anotación proporcionado no es un número válido:", id_anotacion);
            return [null, "ID de anotación no válido"];
        }

        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);

        const AnotacionFound = await AnotacionRepository.findOne({
            where: { id_anotacion: id }
        });

        if (!AnotacionFound) {
            console.error(`Anotación con ID ${id_anotacion} no encontrada`);
            return [null, "Anotación no encontrada"];
        }

        return [AnotacionFound, null];
    } catch (error) {
        console.error("Error al obtener la anotación:", error);
        return [null, "Error interno del servidor"];
    }
}



    
export async function getAnotacionesService() {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const anotaciones = await AnotacionRepository.find();
        if (!anotaciones || anotaciones.length === 0) return [null, "No hay anotaciones"];
        
        return [anotaciones, null];
    } catch (error) {   
        console.error("Error al obtener las anotaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAnotacionesAsignaturaService(id_asignatura) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const anotaciones = await AnotacionRepository.find( { id_asignatura: id_asignatura } );
        if (!anotaciones || anotaciones.length === 0) return [null, "No hay anotaciones"];
        
        return [anotaciones, null];
    } catch (error) {   
        console.error("Error al obtener las anotaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAnotacionesAlumnoService(rut) {
    try {
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);

        // Verificar si el usuario es un alumno (rol 3)
        const alumno = await UsuarioRepository.findOne({
            where: { rut, id_roles: 3 },
        });

        if (!alumno) {
            return [null, "El usuario no es un alumno o no existe"];
        }

        // Buscar las anotaciones asociadas al alumno
        const anotaciones = await AnotacionRepository.find({
            where: { rut },
        });

        if (!anotaciones || anotaciones.length === 0) {
            return [null, "No hay anotaciones para este alumno"];
        }

        return [anotaciones, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones del alumno:", error);
        return [null, "Error interno del servidor"];
    }
}


export async function getAnotacionesCursoService(id_curso) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const UsuarioCursoRepository = AppDataSource.getRepository(Conect_Alumno_CursoSchema);
        const AsignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);

        // Obtener los usuarios asociados al curso
        const usuariosDelCurso = await UsuarioCursoRepository.find({
            where: { id_curso },
            relations: ["usuario"],
        });

        const rutsAlumnos = usuariosDelCurso.map(entry => entry.rut);

        // Verificar si hay alumnos en el curso
        if (rutsAlumnos.length === 0) {
            return [null, "No hay alumnos asociados a este curso"];
        }

        // Obtener las asignaturas asociadas al curso
        const asignaturasDelCurso = await AsignaturaCursoRepository.find({
            where: { id_curso },
        });

        const idsAsignaturas = asignaturasDelCurso.map(entry => entry.id_asignatura);

        // Verificar si hay asignaturas asociadas al curso
        if (idsAsignaturas.length === 0) {
            return [null, "No hay asignaturas asociadas a este curso"];
        }

        // Buscar las anotaciones asociadas a los alumnos y las asignaturas del curso
        const anotaciones = await AnotacionRepository.find({
            where: {
                rut: In(rutsAlumnos),
                id_asignatura: In(idsAsignaturas),
            },
        });

        // Verificar si hay anotaciones
        if (!anotaciones || anotaciones.length === 0) {
            return [null, "No hay anotaciones para este curso"];
        }

        return [anotaciones, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones del curso:", error);
        return [null, "Error interno del servidor"];
    }
}



export async function createAnotacionService(data) {
    try {
        const { descripcion, tipo, id_asignatura, rut } = data;
        const UsuarioRepository = AppDataSource.getRepository(Usuario);

        // Verificar si el usuario es un alumno (rol 3)
        const alumno = await UsuarioRepository.findOne({
            where: { rut, id_roles: 3 },
        });

        if (!alumno) {
            return [null, "El usuario no es un alumno o no existe"];
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

 



