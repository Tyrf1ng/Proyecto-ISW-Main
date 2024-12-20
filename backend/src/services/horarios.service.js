import { AppDataSource } from "../config/configDb.js"; 
import Horarios from "../entity/horarios.entity.js"; 

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

export async function createHorarioService(data) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);
        const horario = horariosRepository.create(data);
        const savedHorario = await horariosRepository.save(horario);
        return [savedHorario, null];
    } catch (error) {
        console.error("Error al crear el horario:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateHorarioService(id_horario, data) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);
        const result = await horariosRepository.update(
            { id_horario: id_horario },
            data
        );
        if (result.affected === 0) {
            return [null, "Horario no encontrado"];
        }
        const updatedHorario = await horariosRepository.findOneBy({ id_horario: id_horario });
        return [updatedHorario, null];
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        return [null, "Error interno del servidor"];
    }
}

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

export async function isHorarioValid(hora_inicio, hora_fin, id_horario = null) {
    try {
        const horariosRepository = AppDataSource.getRepository(Horarios);
        const query = horariosRepository.createQueryBuilder("horarios")
            .where("hora_inicio < :hora_fin AND hora_fin > :hora_inicio", { hora_inicio, hora_fin });
        if (id_horario) {
            query.andWhere("id_horario != :id_horario", { id_horario });
        }
        const overlappingHorarios = await query.getMany();
        return overlappingHorarios.length === 0;
    } catch (error) {
        console.error("Error al validar el horario:", error);
        return false;
    }
}