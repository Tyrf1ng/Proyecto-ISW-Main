import { In } from "typeorm";
import Asignaturas from "../entity/asignatura.entity.js";
import { AppDataSource } from "../config/configDb.js";
import conect_usuario_curso from "../entity/conect_usuario_curso.entity.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";
import AsignaturasSchema from "../entity/asignatura.entity.js";
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

// Función para obtener una asignatura 
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

export async function createAsignatura(rut_docente, nombre) {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const asignaturaRepository = AppDataSource.getRepository(AsignaturasSchema);


        const usuario = await usuarioRepository.findOne({ where: { rut: rut_docente, id_roles: 2 } });
        if (!usuario) {
            return [null, "No se encontró un usuario docente con ese RUT."];
        }

        const nuevaAsignatura = asignaturaRepository.create({ nombre, rut: rut_docente });
        const asignaturaCreada = await asignaturaRepository.save(nuevaAsignatura);

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

//Asignatura pora Alumno

export async function getAsignaturasByAlumno(rut) {
    try {
        const usuarioRepository = AppDataSource.getRepository(Usuario);
        const conectUsuarioCursoRepository = AppDataSource.getRepository(conect_usuario_curso);
        const asignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);
        const asignaturaRepository = AppDataSource.getRepository(Asignaturas);

        //Alumnos
        const usuario = await usuarioRepository.findOne({
            where: { rut: rut, id_roles: 3 }, 
        });

        if (!usuario) {
            return [null, "No se encuentra un usuario con el rol de alumno para este RUT"];
        }

        const cursosDelAlumno = await conectUsuarioCursoRepository.find({
            where: { rut: rut },
        });

        if (!cursosDelAlumno || cursosDelAlumno.length === 0) {
            return [null, "No hay cursos asociados a este alumno"];
        }

        const idsCursos = cursosDelAlumno.map((curso) => curso.id_curso);
        const asignaturasCurso = await asignaturaCursoRepository.find({
            where: { id_curso: In(idsCursos) },
        });

        if (!asignaturasCurso || asignaturasCurso.length === 0) {
            return [null, "No hay asignaturas asociadas a los cursos de este alumno"];
        }

        const idsAsignaturas = asignaturasCurso.map((asignatura) => asignatura.id_asignatura);
        const asignaturas = await asignaturaRepository.find({
            where: { id_asignatura: In(idsAsignaturas) },
            select: ["id_asignatura", "nombre", "rut"],
        });

        if (!asignaturas || asignaturas.length === 0) {
            return [null, "No se encontraron detalles para las asignaturas de este alumno"];
        }
        
    //Obtener nombre de los profesores de cada asignatura
        const rutsProfesores = asignaturas.map((asignatura) => asignatura.rut);
        const profesores = await usuarioRepository.find({
            where: { rut: In(rutsProfesores), id_roles: 2 },
            select: ["rut", "nombre", "apellido"],
        });
        
        const result = asignaturas.map((asignatura) => {
            const profesor = profesores.find((prof) => prof.rut === asignatura.rut);
            return {
                id_asignatura: asignatura.id_asignatura,
                nombre: asignatura.nombre,
                profesor: profesor
                    ? `${profesor.nombre} ${profesor.apellido}`
                    : "Profesor no asignado",
            };
        });
        
        return [result, null];
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

