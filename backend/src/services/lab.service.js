import { AppDataSource } from "../config/configDb.js"; // Asegúrate de que la ruta sea correcta
import Labs from "../entity/lab.entity.js"; // Asegúrate de que la ruta sea correcta

export async function getLabsService() {
    try {
    const labRepository = AppDataSource.getRepository(Labs);

    const labs = await labRepository.find();

    if (!labs || labs.length === 0) return [null, "No hay laboratorios"];

    // No hay campo 'password' en LabsSchema, así que no es necesario excluirlo
    const labsData = labs.map(({ ...lab }) => lab);

    return [labsData, null];
    } catch (error) {
    console.error("Error al obtener a los laboratorios:", error);
    return [null, "Error interno del servidor"];
    }
}

export async function getLabService(query) {
    try {
    const { id, name } = query;

    const labRepository = AppDataSource.getRepository(Labs);

    const labFound = await labRepository.findOne({
        where: [{ id: id }, { name: name }],
    });

    if (!labFound) return [null, "Laboratorio no encontrado"];

    // No hay campo 'password' en LabsSchema, así que no es necesario excluirlo
    const { ...labData } = labFound;

    return [labData, null];
    } catch (error) {
    console.error("Error obtener el laboratorio:", error);
    return [null, "Error interno del servidor"];
    }
}

export async function createLabService(body) {
    try {
    const labRepository = AppDataSource.getRepository(Labs);

    // Verifica si ya existe un laboratorio con el mismo nombre
    const existingLab = await labRepository.findOne({
        where: [{ name: body.name }],
    });

    if (existingLab) return [null, "El laboratorio ya existe"];

    // Crea un nuevo laboratorio
    const newLab = labRepository.create(body);
    await labRepository.save(newLab);

    return [newLab, null];
    } catch (error) {
    console.error("Error al crear el laboratorio:", error);
    return [null, "Error interno del servidor"];
    }
}

export async function updateLabService(query, body) {
    try {
    const { id, name } = query;

    const labRepository = AppDataSource.getRepository(Labs);

    const labFound = await labRepository.findOne({
        where: [{ id: id }, { name: name }],
    });

    if (!labFound) return [null, "Laboratorio no encontrado"];

    const existingLab = await labRepository.findOne({
        where: [{ name: body.name }],
    });

    if (existingLab && existingLab.id !== labFound.id) {
        return [null, "Ya existe un laboratorio con el mismo nombre"];
    }

    labRepository.merge(labFound, body);

    await labRepository.save(labFound);

    return [labFound, null];
    } catch (error) {
    console.error("Error al actualizar el laboratorio:", error);
    return [null, "Error interno del servidor"];
    }
}

export async function deleteLabService(query) {
    try {
    const { id, name } = query;

    const labRepository = AppDataSource.getRepository(Labs);

    const labFound = await labRepository.findOne({
        where: [{ id: id }, { name: name }],
    });

    if (!labFound) return [null, "Laboratorio no encontrado"];

    await labRepository.remove(labFound);

    return [labFound, null];
    } catch (error) {
    console.error("Error al eliminar el laboratorio:", error);
    return [null, "Error interno del servidor"];
    }
}