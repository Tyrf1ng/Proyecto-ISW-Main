import Docentes from "../entity/docente.entity.js";
import Alumno from "../entity/alumno.entity.js";
import Apoderado from "../entity/apoderado.entity.js";
import Administrativo from "../entity/administrativo.entity.js";
import Directivo from "../entity/directivo.entity.js";
import Encargado_Lab from "../entity/encargado.lab.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    const repositories = [
        AppDataSource.getRepository(Directivo),
        AppDataSource.getRepository(Docentes),
        AppDataSource.getRepository(Apoderado),
        AppDataSource.getRepository(Alumno),
        AppDataSource.getRepository(Administrativo),
        AppDataSource.getRepository(Encargado_Lab),
    ];

    let userFound = null;

    for (const repository of repositories) {
      userFound = await repository.findOneBy({ email: req.user.email });
      if (userFound) break; // Detiene la búsqueda si encuentra al usuario
    }

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    if (userFound.id_role !== 1) {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de directivo/administrador para realizar esta acción."
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
