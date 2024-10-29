"use strict";
import Docentes from "../entity/docente.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Administrativo from "../entity/administrativo.entity.js";
import Directivo from "../entity/directivo.entity.js";
import Encargado_Lab from "../entity/encargado.lab.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const { email, password } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const repositories = [
      AppDataSource.getRepository(Directivo),
      AppDataSource.getRepository(Docentes),
      AppDataSource.getRepository(Apoderado),
      AppDataSource.getRepository(Alumno),
      AppDataSource.getRepository(Administrativo),
      AppDataSource.getRepository(Encargado_Lab),
    ];

    let userFound = null;
    let userType = null;

    for (const repository of repositories) {
      userFound = await repository.findOne({ where: { email } });
      if (userFound) {
        userType = repository.metadata.name; // Obtiene el nombre de la entidad
        break; // Sale del bucle si encuentra al usuario
      }
    }

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    const isMatch = await comparePassword(password, userFound.password);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
      tipo: userType, // Añade el tipo de usuario al payload
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
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
