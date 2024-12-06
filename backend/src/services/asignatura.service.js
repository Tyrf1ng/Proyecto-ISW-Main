import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Usuario from "../entity/usuario.entity.js";

export async function getAsignaturasByProfesor(rut) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        const usuario = await usuarioRepository.findOne({
            where: { rut: rut, id_roles: 2 }
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de profesor para este rut"];
        }

        const asignaturas = await asignaturaRepository.find({
            where: { rut: rut } 
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