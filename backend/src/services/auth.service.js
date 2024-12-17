"use strict";
import Usuario from "../entity/usuario.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

// Roles según el id_roles
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
      { repo: AppDataSource.getRepository(Usuario) },
    ];

    let userFound = null;

    for (const { repo } of repositories) {
      userFound = await repo.findOne({ where: { email } });
      if (userFound) break; 
    }

    if (!userFound) {
      return [null, { message: "Usuario no encontrado", field: "email" }];
    }

    const isMatch = await comparePassword(password, userFound.password);
    if (!isMatch) {
      return [null, { message: "Contraseña incorrecta", field: "password" }];
    }

    
    const rolNombre = ROLES_MAP[userFound.id_roles] || "Usuario Desconocido";

    const payload = {
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      email: userFound.email,
      rut: userFound.rut,
      rol: rolNombre, 
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

