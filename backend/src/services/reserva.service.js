import { AppDataSource } from "../config/configDb.js"; 
import Reserva from "../entity/reserva.entity.js"; 
import { Not } from 'typeorm';

export async function getReservasService() {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const reservas = await reservaRepository.find({
      relations: ["lab", "usuario", "horarios", "asignatura", "curso"],
    });

    if (!reservas || reservas.length === 0) return [null, "No hay reservas"];

    const reservasData = reservas.map(reserva => ({
      id_reserva: reserva.id_reserva,
      id_lab: reserva.id_lab,
      rut: reserva.rut,
      laboratorio: reserva.lab.nombre,
      usuario: `${reserva.usuario.nombre} ${reserva.usuario.apellido}`,
      fecha: reserva.fecha,
      horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
      id_horario: reserva.horarios.id_horario,
      id_asignatura: reserva.asignatura.id_asignatura,
      id_curso: reserva.curso.id_curso,
    }));

    return [reservasData, null];
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getReservaService(id) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const reserva = await reservaRepository.findOne({
      where: { id_reserva: id },
      relations: ["lab", "usuario", "horarios", "asignatura", "curso"],
    });

    if (!reserva) return [null, "Reserva no encontrada"];

    const reservaData = {
      id_reserva: reserva.id_reserva,
      laboratorio: reserva.lab.nombre,
      usuario: `${reserva.usuario.nombre} ${reserva.usuario.apellido}`,
      fecha: reserva.fecha,
      horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
      id_horario: reserva.horarios.id_horario,
      id_asignatura: reserva.asignatura.id_asignatura,
      id_curso: reserva.curso.id_curso,
    };

    return [reservaData, null];
  } catch (error) {
    console.error("Error al obtener la reserva:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createReservaService(data) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const existingReservaLab = await reservaRepository.findOne({
      where: { id_lab: data.id_lab, fecha: data.fecha, id_horario: data.id_horario },
    });

    if (existingReservaLab) {
      return [null, "El laboratorio ya está reservado en la misma fecha y horario"];
    }

    const reserva = reservaRepository.create({
      ...data,
      id_asignatura: data.id_asignatura,
      id_curso: data.id_curso,
    });
    const savedReserva = await reservaRepository.save(reserva);

    return [savedReserva, null];
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateReservaService(id_reserva, data) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const existingReservaLab = await reservaRepository.findOne({
      where: { 
        id_lab: data.id_lab, 
        fecha: data.fecha, 
        id_horario: data.id_horario,
        id_reserva: Not(id_reserva)
      },
    });

    if (existingReservaLab) {
      return [null, "El laboratorio ya está reservado en la misma fecha y horario"];
    }

    const reserva = await reservaRepository.findOne({ where: { id_reserva } });

    if (!reserva) {
      return [null, "Reserva no encontrada"];
    }

    reserva.id_lab = data.id_lab;
    reserva.rut = data.rut;
    reserva.fecha = data.fecha;
    reserva.id_horario = data.id_horario;
    reserva.id_asignatura = data.id_asignatura;
    reserva.id_curso = data.id_curso;

    const updatedReserva = await reservaRepository.save(reserva);

    return [updatedReserva, null];
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    return [null, "Error interno del servidor"];
  }
}

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

export async function getReservasByUsuarioService(rut) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const reservas = await reservaRepository.find({
      where: { rut: rut },
      relations: ["lab", "usuario", "horarios"],
    });

    if (!reservas || reservas.length === 0) return [null, "No hay reservas para este usuario"];

    const reservasData = reservas.map(reserva => ({
      id_reserva: reserva.id_reserva,
      laboratorio: reserva.lab.nombre,
      usuario: `${reserva.usuario.nombre} ${reserva.usuario.apellido}`,
      fecha: reserva.fecha,
      horario: `${reserva.horarios.hora_inicio} - ${reserva.horarios.hora_fin}`,
    }));

    return [reservasData, null];
  } catch (error) {
    console.error("Error al obtener las reservas por usuario:", error);
    return [null, "Error interno del servidor"];
  }
}