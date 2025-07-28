import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import DirectivaMiembro from "../entity/DirectivaMiembros.js";

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
    const directivaMiembroRepo = AppDataSource.getRepository(DirectivaMiembro);

    const userFound = await userRepository.findOne({
      where: { email: req.user.email },
      relations: ["rol"],
    });

    if (!userFound) {
      return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos");
    }

    const rolUsuario = userFound.rol?.nombreRol?.toLowerCase();

    // ✅ Si es administrador, permite el acceso directamente
    if (rolUsuario === "administrador") {
      return next();
    }

    // ✅ Verificar si pertenece a una directiva activa
    const hoy = new Date();

    const miembroVigente = await directivaMiembroRepo
      .createQueryBuilder("miembro")
      .leftJoinAndSelect("miembro.periodo", "periodo")
      .where("miembro.id_usuario = :id", { id: userFound.id_usuario })
      .andWhere("periodo.fechaInicio <= :hoy", { hoy })
      .andWhere("periodo.fechaTermino >= :hoy", { hoy })
      .getOne();

    if (!miembroVigente) {
      return handleErrorClient(res, 403, "No pertenece a una directiva activa");
    }

    // ✅ Verificar si su rol dentro de la directiva es válido
    const rolDirectiva = await miembroVigente.rol?.nombreRol?.toLowerCase();
    const rolesPermitidos = ["Presidente", "Tesorero", "Secretario"];

    if (!rolesPermitidos.includes(rolDirectiva)) {
      return handleErrorClient(res, 403, "Rol dentro de la directiva no autorizado");
    }

    next();

  } catch (error) {
    
    return handleErrorServer(res, 500, error.message);

  }
}
