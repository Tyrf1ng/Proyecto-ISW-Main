"use strict";
import { 
    createAlumnoService,
    deleteAlumnoService,
    getAlumnoByRutService,
    getAlumnosByCursoService,
    getAlumnosByNombreService,
    getAlumnosService,
    updateAlumnoService
} from "../services/alumnos.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

/**
 * Obtener todos los alumnos
 */
export async function getAlumnos(req, res) {
    try {
        const [alumnos, errorAlumnos] = await getAlumnosService();
        if (errorAlumnos) return handleErrorClient(res, 404, errorAlumnos);
        alumnos.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Alumnos encontrados", alumnos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Buscar un alumno por RUT
 */
export async function getAlumnoByRut(req, res) {
    try {
        const { rut_alumno } = req.params;
        const [alumno, errorAlumno] = await getAlumnoByRutService(rut_alumno);
        if (errorAlumno) return handleErrorClient(res, 404, errorAlumno);
        handleSuccess(res, 200, "Alumno encontrado", alumno);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Obtener alumnos por curso
 */
export async function getAlumnosByCurso(req, res) {
    try {
        const { id_curso } = req.params;
        console.log("ID Curso recibido:", id_curso); // Log para verificar la entrada

        const [alumnos, errorAlumnos] = await getAlumnosByCursoService(id_curso);
        if (errorAlumnos) {
            console.error("Error al obtener alumnos:", errorAlumnos);
            return res.status(404).json({ error: errorAlumnos });
        }

        console.log("Alumnos devueltos:", alumnos); // Log para verificar la salida
        return res.json(alumnos);
    } catch (error) {
        console.error("Error en getAlumnosByCurso:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

  
  

/**
 * Buscar alumnos por nombre
 */
export async function getAlumnosByNombre(req, res) {
    try {
        const { nombre } = req.query;
        const { id_curso } = req.query; // Opcional, para filtrar por curso
        const [alumnos, errorAlumnos] = await getAlumnosByNombreService(nombre, id_curso);
        if (errorAlumnos) return handleErrorClient(res, 404, errorAlumnos);
        alumnos.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Alumnos encontrados", alumnos);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Crear un nuevo alumno
 */
export async function createAlumno(req, res) {
    try {
        const { nombre, rut_alumno, id_curso } = req.body;
        const [alumno, errorAlumno] = await createAlumnoService({ nombre, rut_alumno, id_curso });
        if (errorAlumno) return handleErrorClient(res, 404, errorAlumno);
        handleSuccess(res, 201, "Alumno creado", alumno);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Actualizar información de un alumno
 */
export async function updateAlumno(req, res) {
    try {
        const { rut_alumno } = req.params;
        const { nombre, id_curso } = req.body;

        const datosActualizados = { nombre, id_curso };
        const [alumno, errorAlumno] = await updateAlumnoService(rut_alumno, datosActualizados);
        if (errorAlumno) return handleErrorClient(res, 404, errorAlumno);
        handleSuccess(res, 200, "Alumno actualizado", alumno);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

/**
 * Eliminar un alumno
 */
export async function deleteAlumno(req, res) {
    try {
        const { rut_alumno } = req.params;
        const [alumno, errorAlumno] = await deleteAlumnoService(rut_alumno);
        if (errorAlumno) return handleErrorClient(res, 404, errorAlumno);
        handleSuccess(res, 200, "Alumno eliminado", alumno);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
