"use strict";
import { AppDataSource } from "../config/configDb.js";
import Encargado_Lab from "../entity/encargado.lab.entity.js";

/**
 * Obtener todos los encargados de laboratorio
 */
export async function getEncargadosLabService() {
    try {
        const EncargadoLabRepository = AppDataSource.getRepository(Encargado_Lab);
        const encargados = await EncargadoLabRepository.find();
        if (!encargados || encargados.length === 0) return [null, "No hay encargados de laboratorio disponibles"];
        return [encargados, null];
    } catch (error) {
        console.error("Error al obtener los encargados de laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Buscar encargado de laboratorio por RUT
 */
export async function getEncargadoLabByRutService(rut_encargado) {
    try {
        const EncargadoLabRepository = AppDataSource.getRepository(Encargado_Lab);
        const encargado = await EncargadoLabRepository.findOne({ where: { rut_encargado } });

        if (!encargado) {
            console.error(`Encargado con RUT ${rut_encargado} no encontrado`);
            return [null, "Encargado no encontrado"];
        }

        return [encargado, null];
    } catch (error) {
        console.error("Error al obtener el encargado de laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Crear un nuevo encargado de laboratorio
 */
export async function createEncargadoLabService(data) {
    try {
        const EncargadoLabRepository = AppDataSource.getRepository(Encargado_Lab);
        const nuevoEncargado = EncargadoLabRepository.create(data);
        await EncargadoLabRepository.save(nuevoEncargado);
        return [nuevoEncargado, null];
    } catch (error) {
        console.error("Error al crear el encargado de laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Actualizar información de un encargado de laboratorio
 */
export async function updateEncargadoLabService(rut_encargado, datosActualizados) {
    try {
        const EncargadoLabRepository = AppDataSource.getRepository(Encargado_Lab);
        const encargadoExistente = await EncargadoLabRepository.findOne({ where: { rut_encargado } });

        if (!encargadoExistente) {
            console.error(`Encargado con RUT ${rut_encargado} no encontrado`);
            return [null, "Encargado no encontrado"];
        }

        EncargadoLabRepository.merge(encargadoExistente, datosActualizados);
        await EncargadoLabRepository.save(encargadoExistente);

        return [encargadoExistente, null];
    } catch (error) {
        console.error("Error al actualizar el encargado de laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

/**
 * Eliminar un encargado de laboratorio
 */
export async function deleteEncargadoLabService(rut_encargado) {
    try {
        const EncargadoLabRepository = AppDataSource.getRepository(Encargado_Lab);
        const encargado = await EncargadoLabRepository.findOne({ where: { rut_encargado } });

        if (!encargado) {
            console.error(`Encargado con RUT ${rut_encargado} no encontrado`);
            return [null, "Encargado no encontrado"];
        }

        await EncargadoLabRepository.remove(encargado);
        return [encargado, null];
    } catch (error) {
        console.error("Error al eliminar el encargado de laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}
