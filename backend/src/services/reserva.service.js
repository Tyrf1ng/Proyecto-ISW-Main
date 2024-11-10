import { AppDataSource } from "../config/configDb.js"; // Asegúrate de que la ruta sea correcta
import Reserva from "../entity/reserva.entity.js"; // Asegúrate de que la ruta sea correcta

//Funciona NO TOCAR
export async function getReservasService() {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        const reservas = await reservaRepository.find({
            relations: ["lab", "docente", "horarios"],
        });

        if (!reservas || reservas.length === 0) return [null, "No hay reservas"];

        const reservasData = reservas.map(reserva => ({
            id_reserva: reserva.id_reserva,
            laboratorio: reserva.lab.nombre,
            docente: `${reserva.docente.nombre} ${reserva.docente.apellido}`,
            fecha: reserva.fecha,
            horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
        }));

        return [reservasData, null];
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function getReservaService(id) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        const reserva = await reservaRepository.findOne({
            where: { id_reserva: id },
            relations: ["lab", "docente", "horarios"],
        });

        if (!reserva) return [null, "Reserva no encontrada"];

        const reservaData = {
            id_reserva: reserva.id_reserva,
            laboratorio: reserva.lab.nombre,
            docente: `${reserva.docente.nombre} ${reserva.docente.apellido}`,
            fecha: reserva.fecha,
            horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
        };

        return [reservaData, null];
    } catch (error) {
        console.error("Error al obtener la reserva:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function createReservaService(data) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        // Verifica si ya existe una reserva para el mismo laboratorio, fecha y horario
        const existingReservaLab = await reservaRepository.findOne({
            where: { id_lab: data.id_lab, fecha: data.fecha, id_horario: data.id_horario },
        });

        if (existingReservaLab) {
            return [null, "El laboratorio ya está reservado en la misma fecha y horario"];
        }

        // Verifica si el docente ya tiene una reserva en la misma fecha y horario
        const existingReservaDocente = await reservaRepository.findOne({
            where: { rut_docente: data.rut_docente, fecha: data.fecha, id_horario: data.id_horario },
        });

        if (existingReservaDocente) {
            return [null, "El docente ya tiene una reserva en la misma fecha y horario"];
        }

        // Crea una nueva reserva
        const reserva = reservaRepository.create(data);
        const savedReserva = await reservaRepository.save(reserva);

        return [savedReserva, null];
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function updateReservaService(id_reserva, data) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        // Verifica si ya existe una reserva para el mismo laboratorio, fecha y horario
        const existingReservaLab = await reservaRepository.findOne({
            where: { id_lab: data.id_lab, fecha: data.fecha, id_horario: data.id_horario },
        });

        if (existingReservaLab && existingReservaLab.id_reserva !== id_reserva) {
            return [null, "El laboratorio ya está reservado en la misma fecha y horario"];
        }

        // Verifica si el docente ya tiene una reserva en la misma fecha y horario
        const existingReservaDocente = await reservaRepository.findOne({
            where: { rut_docente: data.rut_docente, fecha: data.fecha, id_horario: data.id_horario },
        });

        if (existingReservaDocente && existingReservaDocente.id_reserva !== id_reserva) {
            return [null, "El docente ya tiene una reserva en la misma fecha y horario"];
        }

        // Actualiza la reserva con los nuevos datos
        const result = await reservaRepository.update(
            { id_reserva: id_reserva },  // Condición de búsqueda
            data                         // Nuevos datos
        );

        if (result.affected === 0) {
            return [null, "Reserva no encontrada"];
        }

        // Obtén la reserva actualizada
        const updatedReserva = await reservaRepository.findOneBy({ id_reserva: id_reserva });

        return [updatedReserva, null];
    } catch (error) {
        console.error("Error al actualizar la reserva:", error);
        return [null, "Error interno del servidor"];
    }
}

//Funciona NO TOCAR
export async function deleteReservaService(id_reserva) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const result = await reservaRepository.delete(id_reserva);
        return result.affected ? [true, null] : [null, "Reserva no encontrada"];
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        return [null, "Error interno del servidor"];
    }
}

// Nueva función para obtener reservas por laboratorio
export async function getReservasByLabService(id_lab) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        const reservas = await reservaRepository.find({
            where: { id_lab: id_lab },
            relations: ["lab", "docente", "horarios"],
        });

        if (!reservas || reservas.length === 0) return [null, "No hay reservas para este laboratorio"];

        const reservasData = reservas.map(reserva => ({
            id_reserva: reserva.id_reserva,
            laboratorio: reserva.lab.nombre,
            docente: `${reserva.docente.nombre} ${reserva.docente.apellido}`,
            fecha: reserva.fecha,
            horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
        }));

        return [reservasData, null];
    } catch (error) {
        console.error("Error al obtener las reservas por laboratorio:", error);
        return [null, "Error interno del servidor"];
    }
}

// Nueva función para obtener reservas por docente
export async function getReservasByDocenteService(rut_docente) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        const reservas = await reservaRepository.find({
            where: { rut_docente: rut_docente },
            relations: ["lab", "docente", "horarios"],
        });

        if (!reservas || reservas.length === 0) return [null, "No hay reservas para este docente"];

        const reservasData = reservas.map(reserva => ({
            id_reserva: reserva.id_reserva,
            laboratorio: reserva.lab.nombre,
            docente: `${reserva.docente.nombre} ${reserva.docente.apellido}`,
            fecha: reserva.fecha,
            horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
        }));

        return [reservasData, null];
    } catch (error) {
        console.error("Error al obtener las reservas por docente:", error);
        return [null, "Error interno del servidor"];
    }
}

// Nueva función para obtener reservas por fecha
export async function getReservasByFechaService(fecha) {
    try {
        const reservaRepository = AppDataSource.getRepository(Reserva);

        const reservas = await reservaRepository.find({
            where: { fecha: fecha },
            relations: ["lab", "docente", "horarios"],
        });

        if (!reservas || reservas.length === 0) return [null, "No hay reservas para esta fecha"];

        const reservasData = reservas.map(reserva => ({
            id_reserva: reserva.id_reserva,
            laboratorio: reserva.lab.nombre,
            docente: `${reserva.docente.nombre} ${reserva.docente.apellido}`,
            fecha: reserva.fecha,
            horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
        }));

        return [reservasData, null];
    } catch (error) {
        console.error("Error al obtener las reservas por fecha:", error);
        return [null, "Error interno del servidor"];
    }
}