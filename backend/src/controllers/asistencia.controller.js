"use strict";
import {
    createAsistencia,
    deleteAsistencia,
    getAsistencia,
    getAsistenciasAlumno,
    getAsistenciasAsignatura,
    getAsistenciasCurso,
    updateAsistencia
} from "../services/asistencia.service.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getAsistenciasCursoController(req, res) {
    try {
        const { id_curso } = req.params;

        const [asistencias, errorAsistencias] = await getAsistenciasCurso(id_curso);

        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);

        asistencias.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciasAlumnoController(req, res) {
    try {
        const { rut_alumno } = req.params;

        const [asistencias, errorAsistencias] = await getAsistenciasAlumno(rut_alumno);

        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);

        asistencias.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciasAsignaturaController(req, res) {
    try {
        const { id_asignatura } = req.params;
        const [asistencias, errorAsistencias] = await getAsistenciasAsignatura(id_asignatura);
        if (errorAsistencias) return handleErrorClient(res, 404, errorAsistencias);
        asistencias.length === 0 
            ? handleSuccess(res, 204) 
            : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getAsistenciaController(req, res) {
    try {
        const { id_asistencia } = req.params;

        const [asistencia, errorAsistencia] = await getAsistencia(id_asistencia);

        if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);

        handleSuccess(res, 200, "Asistencia encontrada", asistencia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export const updateAsistenciaController = async (req, res) => {
  const { id_asistencia } = req.params;
  const { tipo } = req.body;  // Asegúrate de que el campo se llama "tipo"
  
  if (!tipo) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const [asistenciaActualizada, error] = await updateAsistencia(id_asistencia, tipo);
  if (error) {
      console.error("Error al actualizar la asistencia:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
  }

  return res.json(asistenciaActualizada);
};

export async function createAsistenciaController(req, res) {
    try {
        const { id_asignatura, rut_alumno, tipo } = req.body;
        if (!id_asignatura || !rut_alumno || !tipo) {
            return handleErrorClient(res, 400, "Faltan datos obligatorios");
        }

        const [asistenciaCreada, errorAsistencia] = await createAsistencia({
            id_asignatura,
            rut_alumno,
            tipo,
        });

        if (errorAsistencia) return handleErrorClient(res, 400, errorAsistencia);

        handleSuccess(res, 201, "Asistencia creada", asistenciaCreada);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteAsistenciaController(req, res) {
    try {
        const { id_asistencia } = req.params;

        const [asistencia, errorAsistencia] = await deleteAsistencia(id_asistencia);

        if (errorAsistencia) return handleErrorClient(res, 404, errorAsistencia);

        handleSuccess(res, 200, "Asistencia eliminada", asistencia);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}