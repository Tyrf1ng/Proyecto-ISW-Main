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
import Roles from "../entity/roles.entity.js";
import Conect_Usuario_Curso from "../entity/conect_usuario_curso.entity.js";
import Usuario from "../entity/usuario.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createConectUsuarioCurso() {
  try {
    const conectUsuarioCursoRepository = AppDataSource.getRepository(Conect_Usuario_Curso);

    const count = await conectUsuarioCursoRepository.count();
    if (count > 0) return;

    await Promise.all([
      conectUsuarioCursoRepository.save(
        conectUsuarioCursoRepository.create({
          rut: "21.070.073-0",
          id_curso: 1,
        }),
      ),
    ]);
    console.log("* => Conect_Usuario_Curso creadas exitosamente");
  }
  catch (error) {
    console.error("Error al crear conect_usuario_curso:", error);
  }
}


async function createUsuario() {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const count = await usuarioRepository.count();
    if (count > 0) return;

    await Promise.all([
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "21.282.977-3",
          nombre: "Skibidi",
          apellido: "Insano",
          email: "benjamin@gmail.cl",
          telefono: 123456789,
          password: await encryptPassword("benja123"),
          id_roles: 1,
          comuna: "LA City",
          direccion: "Calle falsa 123",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "20.960.538-4",
          nombre: "Toilet",
          apellido: "Jonathan",
          email: "jonypirinoli@gmail.cl",
          telefono: 987654321,
          password: await encryptPassword("jonypirinoli123"),
          id_roles: 2,
          comuna: "Laja City",
          direccion: "Calle del toilet 69",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "21.070.073-0",
          nombre: "Mochap",
          apellido: "PL",
          email: "mochap@gmail.cl",
          telefono: 987655321,
          password: await encryptPassword("mochap123"),
          id_roles: 3,
          comuna: "Conce City",
          direccion: "Calle del smegma 69",
        }),
      ),
      usuarioRepository.save(
        usuarioRepository.create({
          rut: "21.137.508-6",
          nombre: "Mixtor",
          apellido: "320",
          email: "mixtor@gmail.cl",
          telefono: 987655321,
          password: await encryptPassword("mixtor123"),
          id_roles: 4,
          comuna: "Hualpen City",
          direccion: "Calle del sigma 69",
        }),
      ),
    ]);
    console.log("* => Usuario creado exitosamente");
  }
  catch (error) {
    console.error("Error al crear usuario:", error);
  }
}

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
          nombre: "Precocidad Prematura",
          rut: "20.960.538-4",
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
          descripcion: "Alumno asume como presidente del curso con mucha responsabilidad y entrega",
          rut: "21.070.073-0",
          tipo: "Positiva",
          id_asignatura: 1,
        }),
      ),
      AnotacionesRepository.save(
        AnotacionesRepository.create({
          // eslint-disable-next-line max-len
          descripcion: "Alumno constantemente interrumpe la clase intentando convencer a sus compañeros de unirse al partido comunista",
          rut: "21.070.073-0",
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
          rut: "21.070.073-0",
          id_asignatura: 1,
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
          tipo: "Prueba",
          valor: 2.3,
          rut: "21.070.073-0",
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
          rut: "20.960.538-4",
          id_lab: 1
        }),
      ),
    ]);
    console.log("* => Reservas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear la reserva:", error);
  }
}

export { createConectUsuarioCurso
  , createCursos
  , createRoles
  , createAsignaturas
  , createAsignaturaCurso
  , createAnotaciones
  , createAsistencia
  , createNotas
  , createLabs
  , createHorarios
  , createReserva
  , createUsuario
};

  