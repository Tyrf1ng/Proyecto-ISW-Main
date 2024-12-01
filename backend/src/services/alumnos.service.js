"use strict";
import { In } from "typeorm";
import Alumno from "../entity/alumno.entity.js";
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtener todos los alumnos
 */
export async function getAlumnosService() {
    try {
        const AlumnoRepository = AppDataSource.getRepository(Alumno);
        const alumnos = await AlumnoRepository.find();
        if (!alumnos || alumnos.length === 0) return [null, "No hay alumnos disponibles"];
        return [alumnos, null];
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar alumno por RUT
 */
export async function getAlumnoByRutService(rut_alumno) {
    try {
        const AlumnoRepository = AppDataSource.getRepository(Alumno);
        const alumno = await AlumnoRepository.findOne({ where: { rut_alumno } });

        if (!alumno) {
            console.error(`Alumno con RUT ${rut_alumno} no encontrado`);
            return [null, "Alumno no encontrado"];
        }

        return [alumno, null];
    } catch (error) {
        console.error("Error al obtener el alumno:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar alumnos por curso
 */
export async function getAlumnosByCursoService(id_curso) {
    try {
      const AlumnoRepository = AppDataSource.getRepository(Alumno);
      const alumnos = await AlumnoRepository.find({ where: { id_curso } });
  

  
      if (!alumnos || alumnos.length === 0) {
        return [[], "No hay alumnos para este curso"];
      }
  
      return [alumnos, null];
    } catch (error) {
      console.error("Error al obtener los alumnos del curso:", error);
      return [[], "Error interno del servidor"];
    }
  }
  
  

/**
 * Buscar alumnos por nombre (con filtro)
 */
export async function getAlumnosByNombreService(nombre, id_curso = null) {
    try {
        const AlumnoRepository = AppDataSource.getRepository(Alumno);
        const whereConditions = {
            nombre: Like(`%${nombre}%`), // Buscar alumnos cuyo nombre contiene la cadena proporcionada
        };

        // Si se proporciona un ID de curso, filtrar también por curso
        if (id_curso) {
            whereConditions.id_curso = id_curso;
        }

        const alumnos = await AlumnoRepository.find({ where: whereConditions });

        if (!alumnos || alumnos.length === 0) {
            return [null, "No se encontraron alumnos con el nombre proporcionado"];
        }

        return [alumnos, null];
    } catch (error) {
        console.error("Error al buscar alumnos por nombre:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Crear un nuevo alumno
 */
export async function createAlumnoService(data) {
    try {
        const { nombre, rut_alumno, id_curso } = data;
        const AlumnoRepository = AppDataSource.getRepository(Alumno);
        const nuevoAlumno = AlumnoRepository.create({
            nombre,
            rut_alumno,
            id_curso,
        });

        await AlumnoRepository.save(nuevoAlumno);
        return [nuevoAlumno, null];
    } catch (error) {
        console.error("Error al crear el alumno:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar información de un alumno
 */
export async function updateAlumnoService(rut_alumno, datosActualizados) {
    try {
        const AlumnoRepository = AppDataSource.getRepository(Alumno);
        const alumnoExistente = await AlumnoRepository.findOne({ where: { rut_alumno } });

        if (!alumnoExistente) {
            console.error(`Alumno con RUT ${rut_alumno} no encontrado`);
            return [null, "Alumno no encontrado"];
        }

        AlumnoRepository.merge(alumnoExistente, datosActualizados);
        await AlumnoRepository.save(alumnoExistente);

        return [alumnoExistente, null];
    } catch (error) {
        console.error("Error al actualizar el alumno:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar un alumno
 */
export async function deleteAlumnoService(rut_alumno) {
    try {
        const AlumnoRepository = AppDataSource.getRepository(Alumno);
        const alumno = await AlumnoRepository.findOne({ where: { rut_alumno } });

        if (!alumno) {
            console.error(`Alumno con RUT ${rut_alumno} no encontrado`);
            return [null, "Alumno no encontrado"];
        }

        await AlumnoRepository.remove(alumno);
        return [alumno, null];
    } catch (error) {
        console.error("Error al eliminar el alumno:", error);
        return [null, "Error interno del servidor"];
    }
}
