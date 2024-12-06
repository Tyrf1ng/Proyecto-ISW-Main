import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Usuario from "../entity/usuario.entity.js";


export async function getAsignaturasByProfesor(rut) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const usuarioRepository = AppDataSource.getRepository(Usuario);


        // Validar si el usuario existe y tiene el rol de profesor (id_roles = 2)
        const usuario = await usuarioRepository.find({
            where: { rut: rut, id_roles: 2 },
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de profesor para este rut"];
        }

        const asignaturasDelDocente = await asignaturaRepository.find({
            where: { rut: rut }, 
        });
     
   
        return [asignaturasDelDocente, null];
    } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAsignaturasByAlumno(rut) {
    try {
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
        const usuarioRepository = AppDataSource.getRepository(Usuario);

        // Validar si el usuario existe y tiene el rol de alumno (id_roles = 3)
        const usuario = await usuarioRepository.find({
            where: { rut: rut, id_roles: 3 },
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de alumno para este rut"];
        }

        const asignaturasDelAlumno = await asignaturaRepository.find({
            where: { rut: rut },
        });

        return [asignaturasDelAlumno, null];
    } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        return [null, "Error interno del servidor"];
    }

} 