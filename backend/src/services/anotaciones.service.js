"use strict";
import { In } from "typeorm";
import Anotaciones from "../entity/anotacion.entity.js";
import Usuario from "../entity/usuario.entity.js";
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

export async function getAnotacionesAlumnoService(rut_alumno) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);

        // Buscar las anotaciones asociadas al alumno en específico
        const anotaciones = await AnotacionRepository.find({
            where: { rut_alumno: rut_alumno }
        });

        if (!anotaciones || anotaciones.length === 0) {
            return [null, "No hay anotaciones para este alumno"];
        }

        return [anotaciones, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAnotacionesCursoService(id_curso) {
    try {
        const AlumnoRepository = AppDataSource.getRepository(Usuario);
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const AsignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);

        // Obtener las asignaturas asociadas al curso específico
        const asignaturasDelCurso = await AsignaturaCursoRepository.find({ where: { id_curso } });
        const idsAsignaturas = asignaturasDelCurso.map(ac => ac.id_asignatura);

        if (idsAsignaturas.length === 0) return [null, "No hay asignaturas para este curso"];

        // Obtener los alumnos del curso especificado
        const alumnos = await AlumnoRepository.find({ where: { id_curso } });
        const rutsAlumnos = alumnos.map(alumno => alumno.rut_alumno);

        // Si no hay alumnos en el curso, no habrá anotaciones
        if (rutsAlumnos.length === 0) return [null, "No hay anotaciones para este curso"];

        // Buscar anotaciones para los alumnos del curso y para las asignaturas relacionadas
        const anotaciones = await AnotacionRepository.find({
            where: {
                rut_alumno: In(rutsAlumnos),
                id_asignatura: In(idsAsignaturas),
            },
        });

        if (!anotaciones || anotaciones.length === 0) return [null, "No hay anotaciones para este curso"];
        
        return [anotaciones, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createAnotacionService(data) {
    try {
        const { descripcion, tipo, id_asignatura, rut_alumno } = data;
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const newAnotacion = AnotacionRepository.create({
            descripcion: descripcion,
            tipo: tipo,
            id_asignatura: id_asignatura,
            rut_alumno: rut_alumno
        });
        await AnotacionRepository.save(newAnotacion);
        return [newAnotacion, null];
    } catch (error) {
        console.error("Error al crear la anotacion:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateAnotacionService(id_anotacion, datosActualizados) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);

        const AnotacionFound = await AnotacionRepository.findOne({
            where: { id_anotacion: parseInt(id_anotacion, 10) }
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
        const AnotacionFound = await AnotacionRepository.findOne({ where: { id_anotacion: id_anotacion } });
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

 



