import { In } from "typeorm";
import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";
import Usuario from "../entity/usuario.entity.js"; 

// Función para obtener todas las asignaturas
export async function getAsignaturas() {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const asignaturas = await asignaturaRepository.find();
        if (!asignaturas || asignaturas.length === 0) return [null, "No hay asignaturas"];
        const asignaturasData = asignaturas.map(({ ...asignatura }) => asignatura);
        return [asignaturasData, null];
    } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        return [null, "Error interno del servidor"];
    }
}

// Función para obtener una asignatura por ID
export async function getAsignatura(id_asignatura) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const asignatura = await asignaturaRepository.findOne({
            where: { id_asignatura: id_asignatura }
        });
        if (!asignatura) {
            return [null, "Asignatura no encontrada"];
        }
        return [asignatura, null];
    } catch (error) {
        console.error("Error al obtener la asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}

// Función para crear una asignatura
export async function createAsignatura(asignatura) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const asignaturaCreada = await asignaturaRepository.save(asignatura);
        return [asignaturaCreada, null];
    } catch (error) {
        console.error("Error al crear la asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}

// Función para actualizar una asignatura
export async function updateAsignatura(id_asignatura, asignatura) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const asignaturaActualizada = await asignaturaRepository.update(id_asignatura, asignatura);
        if (!asignaturaActualizada.affected) return [null, "Asignatura no encontrada"];
        return [asignaturaActualizada, null];
    } catch (error) {
        console.error("Error al actualizar la asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}

// Función para eliminar una asignatura
export async function deleteAsignatura(id_asignatura) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const asignaturaEliminada = await asignaturaRepository.delete(id_asignatura);
        if (!asignaturaEliminada.affected) return [null, "Asignatura no encontrada"];
        return [asignaturaEliminada, null];
    } catch (error) {
        console.error("Error al eliminar la asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}

// Función para obtener las asignaturas asociadas a un profesor
export async function getAsignaturasByProfesor(rut) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Buscar el usuario con el rut y validar que tiene id_roles = 2 (profesor)
        const usuario = await usuarioRepository.findOne({
            where: { rut: rut, id_roles: 2 } // id_roles debe ser 2 para profesores
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de profesor para este rut"];
        }

        // Obtener las asignaturas asociadas al profesor (campo `rut` en Asignaturas)
        const asignaturas = await asignaturaRepository.find({
            where: { rut: rut } // Relación directa con el campo `rut` en asignaturas
        });

        if (!asignaturas || asignaturas.length === 0) {
            return [null, "No hay asignaturas para este profesor"];
        }

        const asignaturasData = asignaturas.map(({ ...asignatura }) => asignatura);
        return [asignaturasData, null];
    } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        return [null, "Error interno del servidor"];
    }
}

// Función para obtener el nombre de una asignatura por ID
export async function getNombreAsignaturaById(id_asignatura) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);

        const asignatura = await asignaturaRepository.findOne({
            where: { id_asignatura: id_asignatura }
        });

        if (!asignatura) {
            return [null, "No se encuentra una asignatura con este ID"];
        }

        return [asignatura.nombre, null];
    } catch (error) {
        console.error("Error al obtener el nombre de la asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}
