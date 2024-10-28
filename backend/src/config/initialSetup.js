"use strict";
import User from "../entity/user.entity.js";
import Curso from "../entity/curso.entity.js";
import Directivo from "../entity/directivo.entity.js";
import Roles from "../entity/roles.entity.js";
import Docentes from "../entity/docente.entity.js";
import Asignaturas from "../entity/asignatura.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Alumnos from "../entity/alumno.entity.js";
import Anotaciones from "../entity/anotacion.entity.js";
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
          id_role: 1,
          nombre: "Administrador",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 2,
          nombre: "Docente",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 3,
          nombre: "Alumno",
        }),
      ),
      RolesRepository.save(
        RolesRepository.create({
          id_role: 4,
          nombre: "Apoderado",
        }),
      ),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
  }
}

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Salazar Jara",
          rut: "21.308.770-3",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
        userRepository.save(
          userRepository.create({
            nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
            rut: "20.630.735-8",
            email: "usuario2.2024@gmail.cl",
            password: await encryptPassword("user1234"),
            rol: "usuario",
          }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createDirectivos() {
  try {
    const directivosRepository = AppDataSource.getRepository(Directivo);

    const count = await directivosRepository.count();
    if (count > 0) return;

    await Promise.all([
      directivosRepository.save(
        directivosRepository.create({
          rut_directivo: "21.282.977-3",
          nombre: "Benjamin",
          apellido: "Ortiz",
          correo: "benjamin@gmail.cl",
          telefono: "987654321",
          id_role: 1,
        }),
      ),
    ]);
    console.log("* => Directivos creados exitosamente");
  } catch (error) {
    console.error("Error al crear directivos:", error);
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
          nombre: "5to STS",
          nivel: 5,
          rut_directivo: "21.282.977-3",
        }),
      ),
      cursoRepository.save(
        cursoRepository.create({
          nombre: "7mo SUS",
          nivel: 7,
          rut_directivo: "21.282.977-3",
        }),
      ),
    ]);
    console.log("* => Cursos creados exitosamente");
  } catch (error) {
    console.error("Error al crear cursos:", error);
  }
}

async function createDocente() {
  try {
    const DocenteRepository = AppDataSource.getRepository(Docentes);

    const count = await DocenteRepository.count();
    if (count > 0) return;

    await Promise.all([
      DocenteRepository.save(
        DocenteRepository.create({
          rut_docente: "21.137.508-6",
          nombre: "SKibidi",
          apellido: "Docente",
          email:"Skibidi@gmail.cl",
          telefono: "987654321",
          comuna:"Hualpen(Dde las papas queman)",
          direccion:"Calle falsa 123",
          id_role: "2",
        }),
      ),
    ]);
    console.log("* => Docentes creados exitosamente");
  } catch (error) {
    console.error("Error al crear docentes:", error);
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
          nombre: "Sexualidad Humana",
          rut_docente: "21.137.508-6",
        }),
      ),
    ]);
    console.log("* => Asignaturas creadas exitosamente");
  } catch (error) {
    console.error("Error al crear asignaturas:", error);
  }
}


async function createApoderado() {
  try {
    const ApoderadoRepository = AppDataSource.getRepository(Apoderado);

    const count = await ApoderadoRepository.count();
    if (count > 0) return;

    await Promise.all([
      ApoderadoRepository.save(
        ApoderadoRepository.create({
          rut_apoderado: "21.070.073-0",
          nombre: "Mochap",
          apellido: "Pl",
          telefono: "987654321",
          email:"mochap@gmail.cl",
          id_role: "4",
        }),
      ),
    ]);
    console.log("* => Apoderados creadas exitosamente");
  } catch (error) {
    console.error("Error al crear apoderados:", error);
  }
}


async function createAlumnos() {
  try {
    const AlumnosRepository = AppDataSource.getRepository(Alumnos);

    const count = await AlumnosRepository.count();
    if (count > 0) return;

    await Promise.all([
      AlumnosRepository.save(
        AlumnosRepository.create({
          rut_alumno: "20.960.538-4",
          nombre: "Jonathan",
          apellido: "Toilet",
          fechaNacimiento: "2000-01-01",
          comuna: "Lajino de corazón",
          direccion: "Calle falsa 123",
          id_curso: "1",
          rut_apoderado: "21.070.073-0",
          id_role: "3",
        }),
      ),
    ]);
    console.log("* => Alumnos creadas exitosamente");
  } catch (error) {
    console.error("Error al crear alumnos", error);
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
          descripcion: "Jugando lol en horario de clases",
          rut_alumno: "20.960.538-4",
          tipo: "Negativa",
          id_asignatura: "1",
        }),
      ),
    ]);
    console.log("* => Anotaciones creadas exitosamente");
  } catch (error) {
    console.error("Error al crear anotaciones:", error);
  }
}


export { createUsers
  , createCursos
  , createDirectivos
  , createRoles
  , createDocente
  , createAsignaturas
  , createApoderado, createAlumnos, createAnotaciones };