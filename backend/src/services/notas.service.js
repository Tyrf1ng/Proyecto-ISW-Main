"use strict";
import { In } from "typeorm";
import Notas from "../entity/nota.entity.js";
import { AppDataSource } from "../config/configDb.js";
import alumnos from "../entity/alumno.entity.js";

//funcion para traer todas las notas de un curso
//Funciona no tocar
export async function getNotasCurso(id_curso) {
    try {
        const alumnoRepository = AppDataSource.getRepository(alumnos);
        const alumno = await alumnoRepository.find({
            where: { id_curso: id_curso }
        });

        if (!alumno || alumno.length === 0) {
            return [null, "No hay alumnos en este curso"];
        }

        const rutAlumnos = alumno.map(alumno => alumno.rut_alumno)
        const notaRepository = AppDataSource.getRepository(Notas);
        const nota = await notaRepository.find({
            where: { rut_alumno: In(rutAlumnos) } 
        });

        if (!nota || nota.length === 0) {
            return [null, "No hay notas para este curso"];
        }
        const notasData = nota.map(({ ...nota }) => nota);
        return [notasData, null];
        
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}


//funcion para traer todas las notas de un alumno
//FUNCIONA NO TOCAR
export async function getNotasAlumno(rut_alumno) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const nota = await notasRepository.find({
            where: { rut_alumno: rut_alumno }
        });
        
        if (!nota || nota.length === 0) return [null, "No hay notas"];
        const notaData = nota.map(n => n);     
        return [notaData, null];  

    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}


//funcion para traer todas las notas de un asignatura por alumno
//FUNCIONA NO TOCAR

export async function getNotasAsignatura(id_asignatura) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const notas = await notasRepository.find({
            where: { id_asignatura: id_asignatura },
            relations: ["asignatura"]
        });

        if (!notas || notas.length === 0) return [null, "No hay notas"];

        const notasData = notas.map(nota => ({
            id: nota.id,
            rut_alumno: nota.rut_alumno,
            valor: nota.valor,
            tipo: nota.tipo,
            id_asignatura: nota.id_asignatura,
            nombre_asignatura: nota.asignatura.nombre
        }));

        return [notasData, null];
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}



//funcion para traer una nota por id
//FUNCIONA NO TOCAR
export async function getNota(id_nota) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const nota = await notasRepository.findOneBy({ id_nota: id_nota });

        if (!nota) return [null, "No se encontró la nota"];
        return [nota, null];
    } catch (error) {
        console.error("Error al obtener la nota:", error);
        return [null, "Error interno del servidor"];
    }
}



//funcion para actualizar una nota
//FUNCIONA NO TOCAR
export async function updateNota(id_nota, nuevoValor) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);

       
        const result = await notasRepository.update(
            { id_nota: id_nota },  
            { valor: nuevoValor }   
        );

        if (result.affected === 0) {
            return [null, "No se encontró la nota"];
        }

        return [{ id_nota, valor: nuevoValor }, null]; 
    } catch (error) {
        console.error("Error al actualizar la nota:", error);
        return [null, "Error interno del servidor"];
    }
}



//funcion para crear una nota
//FUNCIONA NO TOCAR
export async function createNota(data) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const nota = notasRepository.create(data);
        const savedNota = await notasRepository.save(nota);
        return [savedNota, null];
    } catch (error) {
        console.error("Error al crear la nota:", error);
        return [null, "Error interno del servidor"];
    }
}



//funcion para eliminar una nota
//FUNCIONA NO TOCAR
export async function deleteNota(id_nota) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const result = await notasRepository.delete(id_nota);
        return result.affected ? [true, null] : [null, "No se encontró la nota"];
    } catch (error) {
        console.error("Error al eliminar la nota:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAllNotas() {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const notas = await notasRepository.find();
        return [notas, null];
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}