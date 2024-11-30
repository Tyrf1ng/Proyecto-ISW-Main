"use strict";
import Docentes from "../entity/docente.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Directivo from "../entity/directivo.entity.js";
import Encargado_Lab from "../entity/encargado.lab.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

// Mapa de roles según el id_roles
const ROLES_MAP = {
  1: "Directivo",
  2: "Docente",
  3: "Alumno",
  4: "Encargado de Laboratorio",
};

export async function loginService(user) {
  try {
    const { email, password } = user;

    const repositories = [
      { repo: AppDataSource.getRepository(Directivo) },
      { repo: AppDataSource.getRepository(Docentes) },
      { repo: AppDataSource.getRepository(Alumno) },
      { repo: AppDataSource.getRepository(Encargado_Lab) },
    ];

    let userFound = null;

    for (const { repo } of repositories) {
      userFound = await repo.findOne({ where: { email } });
      if (userFound) break; // Detiene la búsqueda si encuentra al usuario
    }

    if (!userFound) {
      return [null, { message: "Usuario no encontrado", field: "email" }];
    }

    const isMatch = await comparePassword(password, userFound.password);
    if (!isMatch) {
      return [null, { message: "Contraseña incorrecta", field: "password" }];
    }

    // Determina el nombre del rol basado en id_roles
    const rolNombre = ROLES_MAP[userFound.id_roles] || "Usuario Desconocido";

    const payload = {
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      email: userFound.email,
      rut: userFound.rut_alumno || userFound.rut_docente || userFound.rut_apoderado 
      || userFound.rut_administrativo || userFound.rut_directivo || userFound.rut_encargado,
      rol: rolNombre, // Asigna el nombre del rol al token
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error en loginService:", error);
    return [null, { message: "Error interno del servidor" }];
  }
}


export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });
    
    if (existingEmailUser) return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser) return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol: "usuario",
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
