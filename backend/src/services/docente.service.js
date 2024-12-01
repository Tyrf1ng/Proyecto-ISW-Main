"use strict";
import { Like } from "typeorm";  // Importante para usar LIKE en consultas
import Docente from "../entity/docente.entity.js";  // Asume que tienes la entidad Docente en esta ruta
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtener todos los docentes
 */
export async function getDocentesService() {
    try {
        const DocenteRepository = AppDataSource.getRepository(Docente);
        const docentes = await DocenteRepository.find();
        if (!docentes || docentes.length === 0) return [null, "No hay docentes disponibles"];
        return [docentes, null];
    } catch (error) {
        console.error("Error al obtener los docentes:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar docente por RUT
 */
export async function getDocenteByRutService(rut_docente) {
    try {
        const DocenteRepository = AppDataSource.getRepository(Docente);
        const docente = await DocenteRepository.findOne({ where: { rut_docente } });

        if (!docente) {
            console.error(`Docente con RUT ${rut_docente} no encontrado`);
            return [null, "Docente no encontrado"];
        }

        return [docente, null];
    } catch (error) {
        console.error("Error al obtener el docente:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar docentes por nombre (con filtro)
 */
export async function getDocentesByNombreService(nombre) {
    try {
        const DocenteRepository = AppDataSource.getRepository(Docente);
        const docentes = await DocenteRepository.find({
            where: { nombre: Like(`%${nombre}%`) },
        });

        if (!docentes || docentes.length === 0) {
            return [null, "No se encontraron docentes con el nombre proporcionado"];
        }

        return [docentes, null];
    } catch (error) {
        console.error("Error al buscar docentes por nombre:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Crear un nuevo docente
 */
export async function createDocenteService(data) {
    try {
        const { nombre, rut_docente, email, telefono, departamento } = data;
        const DocenteRepository = AppDataSource.getRepository(Docente);
        const nuevoDocente = DocenteRepository.create({
            nombre,
            rut_docente,
            email,
            telefono,
            departamento,
        });

        await DocenteRepository.save(nuevoDocente);
        return [nuevoDocente, null];
    } catch (error) {
        console.error("Error al crear el docente:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar información de un docente
 */
export async function updateDocenteService(rut_docente, datosActualizados) {
    try {
        const DocenteRepository = AppDataSource.getRepository(Docente);
        const docenteExistente = await DocenteRepository.findOne({ where: { rut_docente } });

        if (!docenteExistente) {
            console.error(`Docente con RUT ${rut_docente} no encontrado`);
            return [null, "Docente no encontrado"];
        }

        DocenteRepository.merge(docenteExistente, datosActualizados);
        await DocenteRepository.save(docenteExistente);

        return [docenteExistente, null];
    } catch (error) {
        console.error("Error al actualizar el docente:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar un docente
 */
export async function deleteDocenteService(rut_docente) {
    try {
        const DocenteRepository = AppDataSource.getRepository(Docente);
        const docente = await DocenteRepository.findOne({ where: { rut_docente } });

        if (!docente) {
            console.error(`Docente con RUT ${rut_docente} no encontrado`);
            return [null, "Docente no encontrado"];
        }

        await DocenteRepository.remove(docente);
        return [docente, null];
    } catch (error) {
        console.error("Error al eliminar el docente:", error);
        return [null, "Error interno del servidor"];
    }
}
