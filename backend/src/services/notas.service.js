"use strict";
import { In } from "typeorm";
import Notas from "../entity/nota.entity.js";
import { AppDataSource } from "../config/configDb.js";
import Conect_Usuario_CursoSchema from "../entity/conect_usuario_curso.entity.js";
import AsignaturaCursoSchema from "../entity/asignatura.curso.entity.js";

//funcion para traer todas las notas de un curso
//Funciona no tocar
export async function getNotasCurso(id_curso) {
    try {
        const UsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_CursoSchema);
        const AsignaturaCursoRepository = AppDataSource.getRepository(AsignaturaCursoSchema);

        const alumno = await UsuarioCursoRepository.find({
            where: { id_curso },
            relations: ["usuario"], 
        });

        const rutsAlumnos = alumno.map(entry => entry.rut)
        if (rutsAlumnos === 0) {
            return [null, "No hay alumnos en este curso"];
        }
        

        const asignaturasDelCurso = await AsignaturaCursoRepository.find({
            where: { id_curso },
        });
        const idsAsignaturas = asignaturasDelCurso.map(entry => entry.id_asignatura);


        if (idsAsignaturas.length === 0) {
            return [null, "No hay asignaturas asociadas a este curso"];
        }

      
        const notaRepository = AppDataSource.getRepository(Notas);

        const notas = await notaRepository.find({
            where: { rut: In(rutsAlumnos),
                id_asignatura: In(idsAsignaturas)
            },
            relations: ["asignatura", "usuario"],

        });

        if (!notas || notas.length === 0) {
            return [null, "No hay notas para este curso"];
        }


        const notasData = notas.map(nota => ({
            id_nota: nota.id_nota,
            tipo: nota.tipo,
            valor: nota.valor,
            rut: nota.usuario.rut,
            nombre_alumno: nota.usuario.nombre,
            apellido_alumno: nota.usuario.apellido,
            nombre_asignatura: nota.asignatura.nombre,
            id_asignatura: nota.asignatura.id_asignatura,
        }));

        return [notasData, null];
        
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para traer todas las notas de un asignatura por alumno
//FUNCIONA NO TOCAR

export async function getNotasAsignatura(id_asignatura) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const notas = await notasRepository.find({
            where: { id_asignatura: id_asignatura },
            relations: ["asignatura", "usuario"],
        });

        if (!notas || notas.length === 0) return [null, "No hay notas"];

        const notasData = notas.map(nota => ({
            ...nota,
            nombre_alumno: nota.usuario.nombre,
            apellido_alumno: nota.usuario.apellido,
            nombre_asignatura: nota.usuario.nombre
        }));

        return [notasData, null];
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para actualizar una nota
//FUNCIONA NO TOCAR
export async function updateNota(id_nota, nuevoValor, nuevoTipo) {
    try {
        // Validar el valor
        const parsedValor = parseFloat(nuevoValor);
        if (isNaN(parsedValor)) {
            return [null, "El valor debe ser un número válido"];
        }

        if (!id_nota) {
            return [null, "El id de la nota es requerido"];
        }

        const notasRepository = AppDataSource.getRepository(Notas);

        // Verificar si la nota existe
        const notaExistente = await notasRepository.findOneBy({ id_nota });
        if (!notaExistente) {
            return [null, "No se encontró la nota"];
        }

        
        const camposActualizar = { valor: parsedValor };
        if (nuevoTipo) {
            camposActualizar.tipo = nuevoTipo;
        }

        const result = await notasRepository.update(
            { id_nota: id_nota },
            camposActualizar
        );

        if (result.affected === 0) {
            return [null, "No se pudo actualizar la nota"];
        }
        return [{ id_nota, valor: parsedValor, tipo: nuevoTipo || notaExistente.tipo }, null];
    } catch (error) {
        console.error("Error al actualizar la nota:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para crear una nota
//FUNCIONA NO TOCAR
export async function createNota(data) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const nota = notasRepository.create(data);
        const savedNota = await notasRepository.save(nota);
        return [savedNota, null];
    } catch (error) {
        console.error("Error al crear la nota:", error);
        return [null, "Error interno del servidor"];
    }
}

//funcion para eliminar una nota
//FUNCIONA NO TOCAR
export async function deleteNota(id_nota) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const result = await notasRepository.delete(id_nota);
        return result.affected ? [true, null] : [null, "No se encontró la nota"];
    } catch (error) {
        console.error("Error al eliminar la nota:", error);
        return [null, "Error interno del servidor"];
    }
}
//Funcion para notas de una asigantura para un alumno

export async function getNotasAlumnoAsignatura(rut, id_asignatura) {
    try {
        const notasRepository = AppDataSource.getRepository(Notas);
        const notas = await notasRepository.find({
            where: { rut: rut, id_asignatura: id_asignatura },
            relations: ["asignatura", "usuario"],
        });

        if (!notas || notas.length === 0) return [null, "No hay notas"];

        const notasData = notas.map(nota => ({
            ...nota,
            nota_tipo: nota.tipo,
            nota_valor: nota.valor,
            nombre_alumno: nota.usuario.nombre,
            apellido_alumno: nota.usuario.apellido,
            nombre_asignatura: nota.asignatura.nombre
        }));

        return [notasData, null];
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        return [null, "Error interno del servidor"];
    }
}
export async function getNotasPorCursoYAsignatura(id_curso, id_asignatura) {
    try {
        const NotasRepository = AppDataSource.getRepository(Notas);
        const ConectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_CursoSchema);
        
        // Obtener los alumnos relacionados con el curso
        const relacionesCurso = await ConectUsuarioCursoRepository.find({
            where: { id_curso },
        });

        if (!relacionesCurso || relacionesCurso.length === 0) {
            return [null, "No hay alumnos asociados a este curso"];
        }

        // Extraer los ruts de los alumnos relacionados con el curso
        const rutsAlumnos = relacionesCurso.map(relacion => relacion.rut);

        // Buscar las anotaciones relacionadas con estos ruts y la asignatura específica
        const notas = await NotasRepository.find({
            where: {
                rut: In(rutsAlumnos),
                id_asignatura,
            },
            relations: ["usuario", "asignatura"],
        });


        if (!notas || notas.length === 0) {
            return [null, "No hay anotaciones para este curso y asignatura"];
        }
   const notasData = notas.map(nota => ({
            ...nota,
            nota_tipo: nota.tipo,
            nota_valor: nota.valor,
            nombre_alumno: nota.usuario.nombre,
            apellido_alumno: nota.usuario.apellido,
            nombre_asignatura: nota.asignatura.nombre
        }));

        return [notasData, null];
    } catch (error) {
        console.error("Error al obtener las anotaciones por curso y asignatura:", error);
        return [null, "Error interno del servidor"];
    }
}
