import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Usuario from "../entity/usuario.entity.js";

export async function getAsignaturasByProfesor(rut) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Buscar el usuario con el rut y verificar que su id_roles sea 2 (profesor)
        const usuario = await usuarioRepository.findOne({
            where: { rut: rut, id_roles: 2 }
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de profesor para este rut"];
        }

        // Obtener las asignaturas asociadas al usuario (rut)
        const asignaturas = await asignaturaRepository.find({
            where: { rut: rut } // Relación con el campo `rut` en asignaturas
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
