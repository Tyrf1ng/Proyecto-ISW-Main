"use strict";
import { In, MoreThanOrEqual, LessThan } from "typeorm";
import Asistencia from "../entity/asistencia.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Usuario from "../entity/usuario.entity.js";
import Asignaturas from "../entity/asignatura.entity.js";
import Conect_Usuario_Curso from "../entity/conect_usuario_curso.entity.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";

const asistenciaRepository = AppDataSource.getRepository(Asistencia);
const usuarioRepository = AppDataSource.getRepository(Usuario);
const asignaturaRepository = AppDataSource.getRepository(Asignaturas);
const conectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_Curso);
const asignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);

export async function getAsistenciasCurso(id_curso) {
    try {
        const conexiones = await conectUsuarioCursoRepository.find({
            where: { id_curso: id_curso },
            relations: ["usuario"]
        });

        if (!conexiones || conexiones.length === 0) {
            return [null, "No hay alumnos en este curso"];
        }

        const rutAlumnos = conexiones.map(conexion => conexion.usuario.rut);

        const asistencias = await asistenciaRepository.find({
            where: { rut: In(rutAlumnos) },
            relations: ["usuario"]
        });

        if (!asistencias || asistencias.length === 0) {
            return [null, "No hay asistencias para este curso"];
        }

        const asistenciasData = asistencias.map(asistencia => ({
            id_asistencia: asistencia.id_asistencia,
            rut: asistencia.rut,
            id_asignatura: asistencia.id_asignatura,
            tipo: asistencia.tipo,
            observacion: asistencia.tipo === "Justificado" ? asistencia.observacion : null,
            createdAt: asistencia.createdAt,
            updatedAt: asistencia.updatedAt,
            usuario: asistencia.usuario ? {
                rut: asistencia.usuario.rut,
                nombre: asistencia.usuario.nombre,
                apellido: asistencia.usuario.apellido,
                email: asistencia.usuario.email,
                direccion: asistencia.usuario.direccion,
                comuna: asistencia.usuario.comuna,
                id_roles: asistencia.usuario.id_roles,
                telefono: asistencia.usuario.telefono,
                createdAt: asistencia.usuario.createdAt,
                updatedAt: asistencia.usuario.updatedAt
            } : null
        }));

        return [asistenciasData, null];

    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAsistenciasAlumno(rut) {
    try {
        const alumno = await usuarioRepository.findOne({ where: { rut, id_roles: 3 } });
        if (!alumno) return [null, "El usuario no es un alumno o no existe"];

        const asistencias = await asistenciaRepository.find({ where: { rut } });

        if (!asistencias || asistencias.length === 0) return [null, "No hay asistencias"];
            return [asistencias, null];
    
        } catch (error) {
            console.error("Error al obtener las asistencias:", error);
            return [null, "Error interno del servidor"];
        }
    }


    export async function getAsistenciasAsignatura(id_asignatura, id_curso) {
        try {
            const asignaturaCurso = await asignaturaCursoRepository.findOne({
                where: {
                    id_asignatura: id_asignatura,
                    id_curso: id_curso
                }
            });
    
            if (!asignaturaCurso) {
                return [null, "No se encontró la asignatura para el curso especificado"];
            }
    
            // Agregamos la relación con "usuario" para obtener los datos del alumno
            const asistencias = await asistenciaRepository.find({
                where: { id_asignatura: id_asignatura },
                relations: ["usuario"] // Aseguramos que venga la info del usuario
            });
    
            if (!asistencias || asistencias.length === 0) {
                return [null, "No hay asistencias"];
            }
    
            const asistenciasData = asistencias.map(asistencia => ({
                id_asistencia: asistencia.id_asistencia,
                rut: asistencia.rut,
                id_asignatura: asistencia.id_asignatura,
                tipo: asistencia.tipo,
                observacion: asistencia.tipo === "Justificado" ? asistencia.observacion : null,
                createdAt: asistencia.createdAt,
                updatedAt: asistencia.updatedAt,
                id_curso: id_curso,
                usuario: asistencia.usuario ? {
                    rut: asistencia.usuario.rut,
                    nombre: asistencia.usuario.nombre,
                    apellido: asistencia.usuario.apellido,
                    email: asistencia.usuario.email,
                    direccion: asistencia.usuario.direccion,
                    comuna: asistencia.usuario.comuna,
                    id_roles: asistencia.usuario.id_roles,
                    telefono: asistencia.usuario.telefono,
                    createdAt: asistencia.usuario.createdAt,
                    updatedAt: asistencia.usuario.updatedAt,
                } : null
            }));
    
            return [asistenciasData, null];
        } catch (error) {
            console.error("Error al obtener las asistencias:", error);
            return [null, "Error interno del servidor"];
        }
    }
    

export async function getAsistencia(id_asistencia) {
    try {
        const asistencia = await asistenciaRepository.findOneBy({ id_asistencia: id_asistencia });

        if (!asistencia) return [null, "No se encontró la asistencia"];
        return [asistencia, null];
    } catch (error) {
        console.error("Error al obtener la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

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

export async function createAsistencia(data) {
    try {
        console.log("Datos recibidos para crear asistencia:", data);

        const asistencia = asistenciaRepository.create({
            ...data,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            id_asignatura: data.id_asignatura,
            id_curso: data.id_curso
        });
        const savedAsistencia = await asistenciaRepository.save(asistencia);
        return [savedAsistencia, null];
    } catch (error) {
        console.error("Error al crear la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteAsistencia(id_asistencia) {
    try {
        const result = await asistenciaRepository.delete(id_asistencia);
        return result.affected ? [true, null] : [null, "No se encontró la asistencia"];
    } catch (error) {
        console.error("Error al eliminar la asistencia:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getAsistenciasAlumnoAsignatura(rut, id_asignatura) {
    try {
      const alumno = await usuarioRepository.findOne({ where: { rut, id_roles: 3 } });
      if (!alumno) return [null, "El usuario no es un alumno o no existe"];
  
      // Verificar que el alumno efectivamente está inscrito en la asignatura
      // Primero buscamos las asignaturas del alumno
      const conexiones = await conectUsuarioCursoRepository.find({ where: { rut } });
      if (!conexiones || conexiones.length === 0) return [null, "El alumno no tiene cursos asignados"];
  
      const idsCursos = conexiones.map(conn => conn.id_curso);
  
      // Verificar si la asignatura y el alumno están relacionados a través de asignatura_curso
      const asignaturaCurso = await asignaturaCursoRepository.findOne({
        where: {
          id_asignatura: id_asignatura,
          id_curso: In(idsCursos) // Debe estar en uno de los cursos del alumno
        }
      });
  
      if (!asignaturaCurso) {
        return [null, "El alumno no está inscrito en esta asignatura"];
      }
  
      // Obtener las asistencias filtradas por rut y asignatura
      const asistencias = await asistenciaRepository.find({
        where: { rut, id_asignatura },
        relations: ["usuario"]
      });
  
      if (!asistencias || asistencias.length === 0) return [null, "No hay asistencias para esta asignatura y alumno"];
  
      const asistenciasData = asistencias.map(asistencia => ({
        id_asistencia: asistencia.id_asistencia,
        rut: asistencia.rut,
        id_asignatura: asistencia.id_asignatura,
        tipo: asistencia.tipo,
        observacion: asistencia.tipo === "Justificado" ? asistencia.observacion : null,
        createdAt: asistencia.createdAt,
        updatedAt: asistencia.updatedAt,
        usuario: asistencia.usuario ? {
          rut: asistencia.usuario.rut,
          nombre: asistencia.usuario.nombre,
          apellido: asistencia.usuario.apellido,
          email: asistencia.usuario.email,
          direccion: asistencia.usuario.direccion,
          comuna: asistencia.usuario.comuna,
          id_roles: asistencia.usuario.id_roles,
          telefono: asistencia.usuario.telefono,
          createdAt: asistencia.usuario.createdAt,
          updatedAt: asistencia.usuario.updatedAt,
        } : null
      }));
  
      return [asistenciasData, null];
    } catch (error) {
      console.error("Error al obtener asistencias del alumno por asignatura:", error);
      return [null, "Error interno del servidor"];
    }
  }
  