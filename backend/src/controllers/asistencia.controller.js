"use strict";
import {
  createAsistenciaService,
  deleteAsistenciaService,
  getAllAsistenciasService,
  getAsistenciaService,
  updateAsistenciaService
} from "../services/asistencia.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Obtener todas las asistencias
export async function getAllAsistencias(req, res) {
  try {
    const [asistencias, error] = await getAllAsistenciasService();
    if (error) return handleErrorClient(res, 404, error);
    asistencias.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Asistencias encontradas", asistencias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener una asistencia por ID
export async function getAsistenciaById(req, res) {
  try {
    const [asistencia, error] = await getAsistenciaService({ id_asistencia: req.params.id });
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Asistencia encontrada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Crear una nueva asistencia
export async function createAsistencia(req, res) {
  try {
    const [asistencia, error] = await createAsistenciaService(req.body);
    if (error) return handleErrorClient(res, 400, error);
    handleSuccess(res, 201, "Asistencia creada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar una asistencia existente
export async function updateAsistencia(req, res) {
  try {
    const [asistencia, error] = await updateAsistenciaService(req.params.id, req.body);
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Asistencia actualizada", asistencia);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar una asistencia
export async function deleteAsistencia(req, res) {
  try {
    const [result, error] = await deleteAsistenciaService(req.params.id);
    if (error) return handleErrorClient(res, 404, error);
    handleSuccess(res, 200, "Asistencia eliminada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
