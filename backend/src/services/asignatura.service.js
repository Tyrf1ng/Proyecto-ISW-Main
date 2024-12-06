import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Usuario from "../entity/usuario.entity.js";
import { In } from "typeorm";
import conect_usuario_curso from "../entity/conect_usuario_curso.entity.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";

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
        // Obtener repositorios necesarios
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const conectUsuarioCursoRepository = AppDataSource.getRepository(conect_usuario_curso);
        const asignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);

        // Validar si el usuario existe y tiene el rol de alumno (id_roles = 3)
        const usuario = await usuarioRepository.findOne({
            where: { rut: rut, id_roles: 3 },
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de alumno para este RUT"];
        }

        // Obtener los cursos asociados al alumno
        const cursosDelAlumno = await conectUsuarioCursoRepository.find({
            where: { rut: rut },
        });

        if (!cursosDelAlumno || cursosDelAlumno.length === 0) {
            return [null, "No hay cursos asociados a este alumno"];
        }

        // Extraer los IDs de los cursos
        const idsCursos = cursosDelAlumno.map((curso) => curso.id_curso);

        // Obtener las asignaturas asociadas a los cursos del alumno
        const asignaturasCurso = await asignaturaCursoRepository.find({
            where: { id_curso: In(idsCursos) },
        });

        if (!asignaturasCurso || asignaturasCurso.length === 0) {
            return [null, "No hay asignaturas asociadas a los cursos de este alumno"];
        }

        // Extraer los IDs de asignaturas
        const idsAsignaturas = asignaturasCurso.map((asignatura) => asignatura.id_asignatura);

        // Obtener los nombres de las asignaturas
        const asignaturas = await asignaturaRepository.find({
            where: { id_asignatura: In(idsAsignaturas) },
            select: ["id_asignatura", "nombre"], // Seleccionar solo los campos necesarios
        });

        if (!asignaturas || asignaturas.length === 0) {
            return [null, "No se encontraron detalles para las asignaturas de este alumno"];
        }

        // Devolver los nombres de las asignaturas
        return [asignaturas, null];
    } catch (error) {
        console.error("Error al obtener las asignaturas:", error);
        return [null, "Error interno del servidor"];
    }
}