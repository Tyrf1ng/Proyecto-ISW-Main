import { AppDataSource } from "../config/configDb.js"; 
import Horarios from "../entity/horarios.entity.js"; 

// FUNCIONA NO TOCAR
export async function getHorariosService() {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);

        const horarios = await horariosRepository.find();

        if (!horarios || horarios.length === 0) return [null, "No hay horarios"];

        return [horarios, null];
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        return [null, "Error interno del servidor"];
    }
}

// FUNCIONA NO TOCAR
export async function getHorarioService(id) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);

        const horarioFound = await horariosRepository.findOne({
            where: { id_horario: id },
        });

        if (!horarioFound) return [null, "Horario no encontrado"];

        return [horarioFound, null];
    } catch (error) {
        console.error("Error al obtener el horario:", error);
        return [null, "Error interno del servidor"];
    }
}

// FUNCIONA NO TOCAR
export async function createHorarioService(data) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);

        // Crea un nuevo horario
        const horario = horariosRepository.create(data);
        const savedHorario = await horariosRepository.save(horario);

        return [savedHorario, null];
    } catch (error) {
        console.error("Error al crear el horario:", error);
        return [null, "Error interno del servidor"];
    }
}

// FUNCIONA NO TOCAR
export async function updateHorarioService(id_horario, data) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);

        // Actualiza el horario con los nuevos datos
        const result = await horariosRepository.update(
            { id_horario: id_horario },  // Condición de búsqueda
            data                         // Nuevos datos
        );

        if (result.affected === 0) {
            return [null, "Horario no encontrado"];
        }

        // Obtén el horario actualizado
        const updatedHorario = await horariosRepository.findOneBy({ id_horario: id_horario });

        return [updatedHorario, null];
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        return [null, "Error interno del servidor"];
    }
}

// FUNCIONA NO TOCAR
export async function deleteHorarioService(id_horario) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);
        const result = await horariosRepository.delete(id_horario);
        return result.affected ? [true, null] : [null, "Horario no encontrado"];
    } catch (error) {
        if (error.code === "23503") {
            return [null, "No se puede eliminar el horario porque está referenciado en reservas"];
        }
        console.error("Error al eliminar el horario:", error);
        return [null, "Error interno del servidor"];
    }
}