import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { email: req.user.email },
      relations: ["rol"],
    });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos",
      );
    }

    if (!userFound.rol || userFound.rol.nombreRol !== "Administrador" && userFound.rol.nombreRol !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "Se requiere un rol de administrador para realizar esta acción."
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function isAdminyDirectiva(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { email: req.user.email },
      relations: ["rol"],
    });

    if (!userFound) {
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos",
      );
    }

    if (!userFound.rol || userFound.rol.nombreRol !== "Administrador" && userFound.rol.nombreRol !== "administrador"&& userFound.rol.nombreRol !== "Presidente"&& userFound.rol.nombreRol !== "Tesorero"&& userFound.rol.nombreRol !== "Secretario") {
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso"
      );
    }

    next();
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
