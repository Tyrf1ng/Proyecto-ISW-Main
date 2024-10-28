"use strict";
import Anotaciones from "../entity/anotacion.entity.js";
import { AppDataSource } from "../config/configDb.js";


export async function getAnotacionService(query) {
    try {
        const { id_anotacion, descripcion, createdAt, tipo, id_asignatura, rut_alumno } = query;
    
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
    
        const AnotacionFound = await AnotacionRepository.findOne({
        where: [{ id_anotacion: id_anotacion }, { descripcion: descripcion }, { fecha: createdAt },
             { tipo: tipo }, { id_asignatura: id_asignatura }, { rut_alumno: rut_alumno }],
        });
    
        if (!AnotacionFound) return [null, "Anotacion no encontrada"];
        console.log(AnotacionFound);
        return [AnotacionFound, null];
    } catch (error) {
        console.error("Error al obtener la anotacion:", error);
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
        const anotaciones = await AnotacionRepository.find( { rut_alumno: rut_alumno } );
        if (!anotaciones || anotaciones.length === 0) return [null, "No hay anotaciones"];
        
        return [anotaciones, null];
    }
    catch (error) {   
        console.error("Error al obtener las anotaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAnotacionesCursoService(id_curso) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const anotaciones = await AnotacionRepository.find( { id_curso: id_curso } );
        if (!anotaciones || anotaciones.length === 0) return [null, "No hay anotaciones"];
        
        return [anotaciones, null];
    }
    catch (error) {   
        console.error("Error al obtener las anotaciones:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createAnotacionService(data) {
    try {
        const { descripcion, fecha, tipo, id_asignatura, rut_alumno } = data;
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const newAnotacion = AnotacionRepository.create({
            descripcion: descripcion,
            fecha: fecha,
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

export async function updateAnotacionService(data) {
    try {
        const { id_anotacion, descripcion, fecha, tipo, id_asignatura, rut_alumno } = data;
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const AnotacionFound = await AnotacionRepository.findOne({ id_anotacion: id_anotacion });
        if (!AnotacionFound) return [null, "Anotacion no encontrada"];
        AnotacionFound.descripcion = descripcion;
        AnotacionFound.fecha = fecha;
        AnotacionFound.tipo = tipo;
        AnotacionFound.id_asignatura = id_asignatura;
        AnotacionFound.rut_alumno = rut_alumno;
        await AnotacionRepository.save(AnotacionFound);
        return [AnotacionFound, null];
    }
    catch (error) {
        console.error("Error al actualizar la anotacion:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteAnotacionService(id_anotacion) {
    try {
        const AnotacionRepository = AppDataSource.getRepository(Anotaciones);
        const AnotacionFound = await AnotacionRepository.findOne({ id_anotacion: id_anotacion });
        if (!AnotacionFound) return [null, "Anotacion no encontrada"];
        await AnotacionRepository.remove(AnotacionFound);
        return [AnotacionFound, null];
    } catch (error) {
        console.error("Error al eliminar la anotacion:", error);
        return [null, "Error interno del servidor"];
    }
}   



