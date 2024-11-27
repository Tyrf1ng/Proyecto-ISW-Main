"use strict";
import { In } from "typeorm";
import Notas from "../entity/nota.entity.js";
import { AppDataSource } from "../config/configDb.js";
import alumnos from "../entity/alumno.entity.js";

//funcion para traer todas las notas de un curso
//Funciona no tocar
export async function getNotasCurso(id_curso) {
    try {
        // Obtener todos los alumnos asociados al curso específico
        const alumnoRepository = AppDataSource.getRepository(alumnos);
        const alumno = await alumnoRepository.find({
            where: { id_curso: id_curso },
        });

        if (!alumno || alumno.length === 0) {
            return [null, "No hay alumnos en este curso"];
        }

        // Extraer los rut de los alumnos para filtrar las notas
        const rutAlumnos = alumno.map(alumnos => alumnos.rut_alumno);

        // Buscar las notas correspondientes a los alumnos en el curso y sus asignaturas relacionadas
        const notaRepository = AppDataSource.getRepository(Notas);
        const notas = await notaRepository.find({
            where: { rut_alumno: In(rutAlumnos) },
            relations: ["asignatura", "alumno"], // Incluye las relaciones necesarias
        });

        if (!notas || notas.length === 0) {
            return [null, "No hay notas para este curso"];
        }

        // Mapear los datos para devolver los detalles de alumno y asignatura junto con la nota
        const notasData = notas.map(nota => ({
            id_nota: nota.id_nota,
            tipo: nota.tipo,
            valor: nota.valor,
            rut_alumno: nota.alumno.rut_alumno,
            nombre_alumno: nota.alumno.nombre,
            apellido_alumno: nota.alumno.apellido,
            nombre_asignatura: nota.asignatura.nombre,
            id_asignatura: nota.asignatura.id_asignatura,
        }));

        return [notasData, null];
        
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}


//funcion para traer todas las notas de un alumno
//FUNCIONA NO TOCAR
//función para traer todas las notas de un alumno
export async function getNotasAlumno(rut_alumno) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const notas = await notasRepository.find({
            where: { rut_alumno: rut_alumno },
            relations: ["asignatura", "alumno"], // Incluye las relaciones necesarias
        });

        if (!notas || notas.length === 0) return [null, "No hay notas"];

        // Mapear los datos para devolver información adicional del alumno y asignatura
        const notasConDatos = notas.map(nota => ({
            id_nota: nota.id_nota,
            tipo: nota.tipo,
            valor: nota.valor,
            rut_alumno: nota.alumno.rut_alumno,
            nombre_alumno: nota.alumno.nombre,
            apellido_alumno: nota.alumno.apellido,
            nombre_asignatura: nota.asignatura.nombre,
            id_asignatura: nota.asignatura.id_asignatura,
        }));

        return [notasConDatos, null];
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
            relations: ["asignatura", "alumno"]
        });

        if (!notas || notas.length === 0) return [null, "No hay notas"];

        const notasData = notas.map(nota => ({
            ...nota,
            nombre_alumno: nota.alumno.nombre,
            apellido_alumno: nota.alumno.apellido,
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
        // Asegúrate de que 'nuevoValor' sea un número
        const parsedValor = parseFloat(nuevoValor);
        if (isNaN(parsedValor)) {
            return [null, "El valor debe ser un número válido"];
        }

        // Verifica si el 'id_nota' es válido
        if (!id_nota) {
            return [null, "El id de la nota es requerido"];
        }

        // Repositorio de TypeORM para interactuar con la tabla Notas
        const notasRepository = AppDataSource.getRepository(Notas);

        // Verifica si la nota con 'id_nota' existe antes de intentar actualizarla
        const notaExistente = await notasRepository.findOneBy({ id_nota });
        if (!notaExistente) {
            return [null, "No se encontró la nota"];
        }

        // Actualiza la nota en la base de datos
        const result = await notasRepository.update(
            { id_nota: id_nota },
            { valor: parsedValor }
        );

        // Verifica si la actualización realmente afectó filas
        if (result.affected === 0) {
            return [null, "No se pudo actualizar la nota"];
        }

        // Devuelve la nota actualizada si todo salió bien
        return [{ id_nota, valor: parsedValor }, null];
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
        const notas = await notasRepository.find({
            relations: ["asignatura", "alumno"], 
        });
        
        // Formatear el resultado para incluir solo el nombre de la asignatura
        const notasConDatos = notas.map(nota => ({
            ...nota,
            nombre_asignatura: nota.asignatura.nombre, 
            nombre_alumno: nota.alumno.nombre,
            apellido_alumno: nota.alumno.apellido,
        }));
        
        
        return [notasConDatos, null];
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}
