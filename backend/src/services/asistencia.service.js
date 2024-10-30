"use strict";
import AsistenciasSchema from "../entity/asistencia.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getAsistenciaService(query) {
  try {
    const { id_asistencia, valor, rut_alumno, id_asignatura } = query;
    
    const asistenciaRepository = AppDataSource.getRepository(AsistenciasSchema);
    
    const asistenciaFound = await asistenciaRepository.findOne({
      where: [
        { id_asistencia: id_asistencia },
        { valor: valor },
        { rut_alumno: rut_alumno },
        { id_asignatura: id_asignatura }
      ],
    });

    if (!asistenciaFound) return [null, "Asistencia no encontrada"];
    console.log(asistenciaFound);
    return [asistenciaFound, null];
  } catch (error) {
    console.error("Error al obtener la asistencia:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getAllAsistenciasService() {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciasSchema);
    const asistencias = await asistenciaRepository.find();
    if (!asistencias || asistencias.length === 0) return [null, "No hay asistencias"];
    
    console.log(asistencias);
    return [asistencias, null];
  } catch (error) {
    console.error("Error al obtener las asistencias:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createAsistenciaService(data) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciasSchema);
    const asistencia = asistenciaRepository.create(data);
    const savedAsistencia = await asistenciaRepository.save(asistencia);
    return [savedAsistencia, null];
  } catch (error) {
    console.error("Error al crear la asistencia:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateAsistenciaService(id, data) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciasSchema);
    await asistenciaRepository.update(id, data);
    const updatedAsistencia = await asistenciaRepository.findOne(id);
    return updatedAsistencia ? [updatedAsistencia, null] : [null, "Asistencia no encontrada"];
  } catch (error) {
    console.error("Error al actualizar la asistencia:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteAsistenciaService(id) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(AsistenciasSchema);
    const result = await asistenciaRepository.delete(id);
    return result.affected ? [true, null] : [null, "Asistencia no encontrada"];
  } catch (error) {
    console.error("Error al eliminar la asistencia:", error);
    return [null, "Error interno del servidor"];
  }
}
