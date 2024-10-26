"use strict";
import User from "../entity/user.entity.js";
import Curso from "../entity/curso.entity.js";
import Directivo from "../entity/directivo.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

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
          telefono: "987654321"
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





export { createUsers, createCursos, createDirectivos };