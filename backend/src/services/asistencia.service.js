"use strict";
import { In, } from "typeorm";
import Asistencia from "../entity/asistencia.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Usuario from "../entity/usuario.entity.js";
import Conect_Usuario_Curso from "../entity/conect_usuario_curso.entity.js";

const asistenciaRepository = AppDataSource.getRepository(Asistencia);
const usuarioRepository = AppDataSource.getRepository(Usuario);

// Obtener las asistencias de un alumno para una fecha, se utiliza al momento de crear una asistencia para verificar si ya existe una asistencia para ese alumno en esa fecha
export async function getAsistenciasAlumnoFecha(rut, fecha, id_asignatura) {
    try {
        const alumno = await usuarioRepository.findOne({ where: { rut, id_roles: 3 } });
        if (!alumno) return [null, "El usuario no es un alumno o no existe"];

        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fecha);
        fechaFin.setHours(23, 59, 59, 999);

        const asistencias = await asistenciaRepository.createQueryBuilder("asistencia")
            .leftJoinAndSelect("asistencia.usuario", "usuario")
            .where("asistencia.rut = :rut", { rut })
            .andWhere("asistencia.id_asignatura = :id_asignatura", { id_asignatura })
            .andWhere("asistencia.createdAt BETWEEN :fechaInicio AND :fechaFin", { fechaInicio, fechaFin })
            .getMany();

        if (!asistencias || asistencias.length === 0) {
            return [null, "No hay asistencias para esta fecha y asignatura"];
        }

        return [asistencias, null];
    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        return [null, "Error interno del servidor"];
    }
}

// Funcion para crear una asistencia
export async function createAsistenciasService(data) {
    try {
        const { rut, id_asignatura, tipo, observacion, createdAt } = data;
        const UsuarioRepository = AppDataSource.getRepository(Usuario);

        const alumno = await UsuarioRepository.findOne({
            where: { rut, id_roles: 3 },
        });

        if (!alumno) {
            return [null, "El RUT proporcionado no corresponde a un alumno o no existe"];
        }

        const AsistenciaRepository = AppDataSource.getRepository(Asistencia);
        const NewAsistencia = AsistenciaRepository.create({
            rut,
            id_asignatura,
            tipo,
            observacion,
            createdAt,
        });
        await AsistenciaRepository.save(NewAsistencia);
        return [NewAsistencia, null];
    } catch (error) {
        console.error("Error al crear la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

// Funcion para actualizar una asistencia
export async function updateAsistencia(id_asistencia, nuevoTipo, observacion) {
    try {
        if (nuevoTipo === "Justificado" && !observacion) {
            return [null, "La observación es obligatoria cuando el tipo es Justificado"];
        }

        const result = await asistenciaRepository.update(
            { id_asistencia: id_asistencia },
            { tipo: nuevoTipo, observacion: observacion || null }
        );

        if (result.affected === 0) {
            return [null, "No se encontró la asistencia"];
        }

        return [{ id_asistencia, tipo: nuevoTipo, observacion: observacion || null }, null];
    } catch (error) {
        console.error("Error al actualizar la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

// Funcion para eliminar una asistencia
export async function deleteAsistencia(id_asistencia) {
    try {
        const result = await asistenciaRepository.delete(id_asistencia);
        return result.affected ? [true, null] : [null, "No se encontró la asistencia"];
    } catch (error) {
        console.error("Error al eliminar la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

// Funcion para obtener las asistencias de un alumno por asignatura sirve para las asistencias desde la vista del alumno
export async function getAsistenciasPorCursoYAsignaturaService(id_curso, id_asignatura) {
    try {
        const AsistenciasRepository = AppDataSource.getRepository(Asistencia);
        const ConectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_Curso);

        //obtener los alumnos del curso
        const alumnos = await ConectUsuarioCursoRepository.find({
            where: { id_curso },
        });

        if (!alumnos || alumnos.length === 0) {
            return [null, "No hay alumnos en el curso"];
        }

        //Extraer los ruts de los alumnos relacionados al curso
        const rutsAlumnos = alumnos.map(alumno => alumno.rut);

        //buscar las asistencias relacionadas con estos ruts y la asignatura especifica
        const asistencias = await AsistenciasRepository.find({
            where: {
                rut: In(rutsAlumnos),
                id_asignatura
            }
        });

        if (!asistencias || asistencias.length === 0) {
            return [null, "No hay asistencias para este curso y asignatura"];
        }

        return [asistencias, null];

    } catch (error) {
        console.error("Error al obtener las asistencias por curso y asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}

// Funcion para obtener las asistencias de un alumno por asignatura sirve para las asistencias desde la vista del profesor
export async function getAsistenciasPorRutYAsignaturaService(rut, id_asignatura) {
    try {
        //Validar que el RUT y la asignatura estan proporcionados
        if (!rut || !id_asignatura) {
            return [null, "El RUT y la asignatura son obligatorios"];
        }

        //Verificar que el RUT pertenece a un usuario con rol 3
        const UsuarioRepository = AppDataSource.getRepository(Usuario);
        const alumno = await UsuarioRepository.findOne({
            where: { rut: rut, id_roles: 3 },
        });

        if (!alumno) {
            console.error(`Usuario con RUT ${rut} no encontrado o no tiene el rol 3`);
            return [null, "El RUT proporcionado no corresponde a un alumno"];
        }

        //Obtener las asistencias filtradas por rut y asignatura
        const AsistenciaRepository = AppDataSource.getRepository(Asistencia);
        const asistencias = await AsistenciaRepository.find({
            where: {
                rut: rut,
                id_asignatura: id_asignatura
            },
        });

        if (!asistencias || asistencias.length === 0) {
            return [null, "No hay asistencias para este alumno y asignatura"];
        }
        return [asistencias, null];

    } catch (error) {
        console.error("Error al obtener las asistencias por rut y asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}

