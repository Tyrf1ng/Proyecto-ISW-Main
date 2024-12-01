"use strict";
import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getAsignaturasByProfesor(rut_docente) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const asignaturas = await asignaturaRepository.find({
            where: { rut_docente: rut_docente }
        });
        if (!asignaturas || asignaturas.length === 0) return [null, "No hay asignaturas"];
        const asignaturasData = asignaturas.map(({ ...asignatura }) => asignatura);
        return [asignaturasData, null];
    } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        return [null, "Error interno del servidor"];
    }
}