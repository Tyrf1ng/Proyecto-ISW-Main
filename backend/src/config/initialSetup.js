"use strict";
import Curso from "../entity/curso.entity.js";
import Asignaturas from "../entity/asignatura.entity.js";
import Asistencia from "../entity/asistencia.entity.js";
import Anotaciones from "../entity/anotacion.entity.js";
import Asignatura_Curso from "../entity/asignatura.curso.entity.js";
import Notas from "../entity/nota.entity.js";
import Labs from "../entity/lab.entity.js";
import Horarios from "../entity/horarios.entity.js";
import Reserva from "../entity/reserva.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";


async function createRoles() {
  try {
    const RolesRepository = AppDataSource.getRepository(Roles);

    const count = await RolesRepository.count();
    if (count > 0) return;

    await Promise.all([
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 1,
          nombre: "Directivo",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 2,
          nombre: "Docente",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 3,
          nombre: "Alumno",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_roles: 4,
          nombre: "Encargado_Laboratorio",
        }),
      ),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
  }
}

async function createCursos() {
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);

    const count = await cursoRepository.count();
    if (count > 0) return;

    await Promise.all([
      cursoRepository.save(
        cursoRepository.create({
          nombre: "Sigma",
          nivel: 2,
        }),
      ),
      cursoRepository.save(
        cursoRepository.create({
          nombre: "Toilet",
          nivel: 4,
        }),
      ),
    ]);
    console.log("* => Cursos creados exitosamente");
  } catch (error) {
    console.error("Error al crear cursos:", error);
  }
}


async function createAsignaturas() {
  try {
    const AsignaturasRepository = AppDataSource.getRepository(Asignaturas);

    const count = await AsignaturasRepository.count();
    if (count > 0) return;

    await Promise.all([
      AsignaturasRepository.save(
        AsignaturasRepository.create({
          nombre: "Matematicas",
          rut_docente: "5.126.663-3",
        }),
      ),
      AsignaturasRepository.save(
        AsignaturasRepository.create({
          nombre: "Lenguaje",
          rut_docente: "5.126.663-4",
        }),
      ),
    ]);
    
    console.log("* => Asignaturas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear asignaturas:", error);
  }
}


async function createAsignaturaCurso() {
  try {
    const AsignaturaCursoRepository = AppDataSource.getRepository(Asignatura_Curso);

    const count = await AsignaturaCursoRepository.count();
    if (count > 0) return;

    await Promise.all([
      AsignaturaCursoRepository.save(
        AsignaturaCursoRepository.create({
          id_curso: 1,
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Anotaciones_Curso creadas exitosamente");
  } catch (error) {
    console.error("Error al crear anotaciones_curso:", error);
  }
}

async function createAnotaciones() {
  try {
    const AnotacionesRepository = AppDataSource.getRepository(Anotaciones);

    const count = await AnotacionesRepository.count();
    if (count > 0) return;

    await Promise.all([
      AnotacionesRepository.save(
        AnotacionesRepository.create({
          descripcion: "Distrayendo a compañeros en horario de clases",
          rut_alumno: "20.960.538-4",
          tipo: "Negativa",
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Anotaciones creadas exitosamente");
  } catch (error) {
    console.error("Error al crear anotaciones:", error);
  }
}

async function createAsistencia() {
  try {
    const AsistenciaRepository = AppDataSource.getRepository(Asistencia);

    const count = await AsistenciaRepository.count();
    if (count > 0) return;

    await Promise.all([
      AsistenciaRepository.save(
        AsistenciaRepository.create({
          fecha: "2021-09-01",
          tipo: "Presente",
          rut_alumno: "20.960.538-4",
          id_asignatura: 1,
        }),
      ),
      AsistenciaRepository.save(
        AsistenciaRepository.create({
          fecha: "2021-09-01",
          tipo: "Presente",
          rut_alumno: "4.705.624-1",
          id_asignatura: 2,
        }),
      ),
    ]);
    console.log("* => Asistencias creadas exitosamente");
  } catch (error) {
    console.error("Error al crear asistencia:", error);
  }
}

async function createNotas() {
  try {
    const NotasRepository = AppDataSource.getRepository(Notas);

    const count = await NotasRepository.count();
    if (count > 0) return;

    await Promise.all([
      NotasRepository.save(
        NotasRepository.create({
          tipo: "C1",
          valor: 0.3,
          rut_alumno: "20.960.538-4",
          id_asignatura: 1,
        }),
      ),
    ]);
    console.log("* => Notas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear notas:", error);
  }
}

async function createLabs() {
  try {
    const laboratoriosRepository = AppDataSource.getRepository(Labs);

    const count = await laboratoriosRepository.count();
    if (count > 0) return;

    await Promise.all([
      laboratoriosRepository.save(
        laboratoriosRepository.create({
          nombre: "Lab1",
          capacidad: 30
        }),
      ),
    ]);
    console.log("* => Labs creados exitosamente");
  } catch (error) {
    console.error("Error al crear labs:", error);
  }
}

async function createHorarios() {
  try {
    const horariosRepository = AppDataSource.getRepository(Horarios);

    const count = await horariosRepository.count();
    if (count > 0) return;

    await Promise.all([
      horariosRepository.save(
        horariosRepository.create({
          hora_inicio: "08:00",
          hora_fin: "09:30",
          rut_encargado: "21.019.643-9",
        }),
      ),
    ]);
    console.log("* => Horarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear horarios:", error);
  }
}

async function createReserva() {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);

    const count = await reservaRepository.count();
    if (count > 0) return;

    await Promise.all([
      reservaRepository.save(
        reservaRepository.create({
          fecha:"2021-09-01",
          id_horario: 1,
          rut_docente: "5.126.663-3",
          id_lab: 1
        }),
      ),
    ]);
    console.log("* => Reservas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear la reserva:", error);
  }
}

export { createCursos
  , createRoles
  , createAsignaturas
  , createAsignaturaCurso
  , createAnotaciones
  , createAsistencia
  , createNotas
  , createLabs
  , createHorarios
  , createReserva
};

  