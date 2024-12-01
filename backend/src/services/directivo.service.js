"use strict";
import { Like } from "typeorm";
import Directivo from "../entity/directivo.entity.js"; 
import { AppDataSource } from "../config/configDb.js";

/**
 * Obtener todos los directivos
 */
export async function getDirectivosService() {
    try {
        const DirectivoRepository = AppDataSource.getRepository(Directivo);
        const directivos = await DirectivoRepository.find();
        if (!directivos || directivos.length === 0) return [null, "No hay directivos disponibles"];
        return [directivos, null];
    } catch (error) {
        console.error("Error al obtener los directivos:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar directivo por RUT
 */
export async function getDirectivoByRutService(rut_directivo) {
    try {
        const DirectivoRepository = AppDataSource.getRepository(Directivo);
        const directivo = await DirectivoRepository.findOne({ where: { rut_directivo } });

        if (!directivo) {
            console.error(`Directivo con RUT ${rut_directivo} no encontrado`);
            return [null, "Directivo no encontrado"];
        }

        return [directivo, null];
    } catch (error) {
        console.error("Error al obtener el directivo:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Crear un nuevo directivo
 */
export async function createDirectivoService(data) {
    try {
        const { nombre, rut_directivo, email, telefono, cargo } = data;
        const DirectivoRepository = AppDataSource.getRepository(Directivo);
        const nuevoDirectivo = DirectivoRepository.create({
            nombre,
            rut_directivo,
            email,
            telefono,
            cargo,
        });

        await DirectivoRepository.save(nuevoDirectivo);
        return [nuevoDirectivo, null];
    } catch (error) {
        console.error("Error al crear el directivo:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar información de un directivo
 */
export async function updateDirectivoService(rut_directivo, datosActualizados) {
    try {
        const DirectivoRepository = AppDataSource.getRepository(Directivo);
        const directivoExistente = await DirectivoRepository.findOne({ where: { rut_directivo } });

        if (!directivoExistente) {
            console.error(`Directivo con RUT ${rut_directivo} no encontrado`);
            return [null, "Directivo no encontrado"];
        }

        DirectivoRepository.merge(directivoExistente, datosActualizados);
        await DirectivoRepository.save(directivoExistente);

        return [directivoExistente, null];
    } catch (error) {
        console.error("Error al actualizar el directivo:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar un directivo
 */
export async function deleteDirectivoService(rut_directivo) {
    try {
        const DirectivoRepository = AppDataSource.getRepository(Directivo);
        const directivo = await DirectivoRepository.findOne({ where: { rut_directivo } });

        if (!directivo) {
            console.error(`Directivo con RUT ${rut_directivo} no encontrado`);
            return [null, "Directivo no encontrado"];
        }

        await DirectivoRepository.remove(directivo);
        return [directivo, null];
    } catch (error) {
        console.error("Error al eliminar el directivo:", error);
        return [null, "Error interno del servidor"];
    }
}
