"use strict";
import { In } from "typeorm";
import Asistencia from "../entity/asistencia.entity.js";
import { AppDataSource } from "../config/configDb.js";
import alumnos from "../entity/alumno.entity.js";

//funcion para traer todas las asistencias de un curso
export async function getAsistenciasCurso(id_curso) {
    try {
        const alumnoRepository = AppDataSource.getRepository(alumnos);
        const alumno = await alumnoRepository.find({
            where: { id_curso: id_curso }
        });

        if (!alumno || alumno.length === 0) {
            return [null, "No hay alumnos en este curso"];
        }

        const rutAlumnos = alumno.map(alumno => alumno.rut_alumno);
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const asistencia = await asistenciaRepository.find({
            where: { rut_alumno: In(rutAlumnos) }
        });

        if (!asistencia || asistencia.length === 0) {
            return [null, "No hay asistencias para este curso"];
        }
        const asistenciasData = asistencia.map(({ ...asistencia }) => asistencia);
        return [asistenciasData, null];
        
    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para traer todas las asistencias de un alumno
export async function getAsistenciasAlumno(rut_alumno) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const asistencia = await asistenciaRepository.find({
            where: { rut_alumno: rut_alumno }
        });
        
        if (!asistencia || asistencia.length === 0) return [null, "No hay asistencias"];
        const asistenciaData = asistencia.map(a => a);     
        return [asistenciaData, null];  

    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para traer todas las asistencias de una asignatura por alumno
export async function getAsistenciasAsignatura(id_asignatura) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const asistencias = await asistenciaRepository.find({
            where: { id_asignatura: id_asignatura }
        });

        if (!asistencias || asistencias.length === 0) return [null, "No hay asistencias"];

        const asistenciasData = asistencias.map(({ ...asistencia }) => asistencia);
        return [asistenciasData, null];
    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para traer una asistencia por id
export async function getAsistencia(id_asistencia) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const asistencia = await asistenciaRepository.findOneBy({ id_asistencia: id_asistencia });

        if (!asistencia) return [null, "No se encontró la asistencia"];
        return [asistencia, null];
    } catch (error) {
        console.error("Error al obtener la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para actualizar una asistencia
export async function updateAsistencia(id_asistencia, nuevoTipo) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);

        const result = await asistenciaRepository.update(
            { id_asistencia: id_asistencia },  
            { tipo: nuevoTipo }   
        );

        if (result.affected === 0) {
            return [null, "No se encontró la asistencia"];
        }

        return [{ id_asistencia, tipo: nuevoTipo }, null]; 
    } catch (error) {
        console.error("Error al actualizar la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para crear una asistencia
export async function createAsistencia(data) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const asistencia = asistenciaRepository.create(data);
        const savedAsistencia = await asistenciaRepository.save(asistencia);
        return [savedAsistencia, null];
    } catch (error) {
        console.error("Error al crear la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para eliminar una asistencia
export async function deleteAsistencia(id_asistencia) {
    try {
        const asistenciaRepository = AppDataSource.getRepository(Asistencia);
        const result = await asistenciaRepository.delete(id_asistencia);
        return result.affected ? [true, null] : [null, "No se encontró la asistencia"];
    } catch (error) {
        console.error("Error al eliminar la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}