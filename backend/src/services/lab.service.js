import { AppDataSource } from "../config/configDb.js"; // Asegúrate de que la ruta sea correcta
import Labs from "../entity/lab.entity.js"; // Asegúrate de que la ruta sea correcta

//Funciona NO TOCAR
export async function getLabsService() {
    try {
        const labRepository = AppDataSource.getRepository(Labs);
        const labs = await labRepository.find();
        if (!labs || labs.length === 0) return [null, "No hay laboratorios"];
        const labsData = labs.map(({ ...lab }) => lab);
        return [labsData, null];
    } catch (error) {
        console.error("Error al obtener a los laboratorios:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function getLabService(id) {
    try {
        const labRepository = AppDataSource.getRepository(Labs);
        const labFound = await labRepository.findOne({
            where: { id_lab: id },
        });
        if (!labFound) return [null, "Laboratorio no encontrado"];
        const { ...labData } = labFound;
        return [labData, null];
    } catch (error) {
        console.error("Error al obtener el laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function createLabService(data) {
    try {
        const labRepository = AppDataSource.getRepository(Labs);
        const existingLab = await labRepository.findOne({
            where: { nombre: data.nombre },
        });
        if (existingLab) return [null, "El laboratorio ya existe"];
        const lab = labRepository.create(data);
        const savedLab = await labRepository.save(lab);
        console.log("Laboratorio creado:", savedLab); // Agrega este log
        return [savedLab, null];
    } catch (error) {
        console.error("Error al crear el laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function updateLabService(id_lab, data) {
    try {
        const labRepository = AppDataSource.getRepository(Labs);
        const result = await labRepository.update(
            { id_lab: id_lab },
            data
        );
        if (result.affected === 0) {
            return [null, "Laboratorio no encontrado"];
        }
        const updatedLab = await labRepository.findOneBy({ id_lab: id_lab });
        return [updatedLab, null];
    } catch (error) {
        console.error("Error al actualizar el laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function deleteLabService(id_lab) {
    try {
        const labRepository = AppDataSource.getRepository(Labs);
        const result = await labRepository.delete(id_lab);
        return result.affected ? [true, null] : [null, "Laboratorio no encontrado"];
    } catch (error) {
        if (error.code === "23503") {
            return [null, "No se puede eliminar el laboratorio porque está referenciado en reservas"];
        }
        console.error("Error al eliminar el laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

