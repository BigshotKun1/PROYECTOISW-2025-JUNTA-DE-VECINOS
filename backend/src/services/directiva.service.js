import { AppDataSource } from "../config/configDb.js";
import { Brackets } from "typeorm";

export async function createDirectivaService({ id_usuario, id_rol, fechaInicio, fechaTermino }) {
  try {
    const directivaRepo = AppDataSource.getRepository("Directiva");
    const rolRepo = AppDataSource.getRepository("Rol");

    if (new Date(fechaInicio) >= new Date(fechaTermino)) {
      return [null, "La fecha de inicio debe ser anterior a la fecha de término"];
    }

    const rolesPermitidos = ["presidente", "tesorero", "secretario"];

    const rol = await rolRepo.findOne({ where: { id_rol } });
    if (!rol) return [null, "Rol no encontrado"];
    if (!rolesPermitidos.includes(rol.nombreRol.toLowerCase())) {
      return [null, "Rol no permitido para una directiva"];
    }

    // Validar solapamiento de fechas para el mismo rol
    const solapamiento = await directivaRepo
      .createQueryBuilder("d")
      .where("d.id_rol = :id_rol", { id_rol })
      .andWhere(new Brackets(qb => {
        qb.where(":fechaInicio BETWEEN d.FechaInicio AND d.FechaTermino", { fechaInicio })
          .orWhere(":fechaTermino BETWEEN d.FechaInicio AND d.FechaTermino", { fechaTermino })
          .orWhere("d.FechaInicio BETWEEN :fechaInicio AND :fechaTermino", { fechaInicio, fechaTermino });
      }))
      .getOne();

    if (solapamiento) {
      return [null, "Ya existe una directiva con ese rol en el período indicado"];
    }

    // Validar solapamiento de fechas para el mismo usuario con otro rol
    const solapamientoUsuario = await directivaRepo
      .createQueryBuilder("d")
      .where("d.id_usuario = :id_usuario", { id_usuario })
      .andWhere(new Brackets(qb => {
        qb.where(":fechaInicio BETWEEN d.FechaInicio AND d.FechaTermino", { fechaInicio })
          .orWhere(":fechaTermino BETWEEN d.FechaInicio AND d.FechaTermino", { fechaTermino })
          .orWhere("d.FechaInicio BETWEEN :fechaInicio AND :fechaTermino", { fechaInicio, fechaTermino });
      }))
      .getOne();

    if (solapamientoUsuario) {
      return [null, "El usuario ya tiene asignada una directiva en ese período"];
    }

    const nuevaDirectiva = directivaRepo.create({
      usuario: { id_usuario },
      rol: { id_rol },
      FechaInicio: fechaInicio,
      FechaTermino: fechaTermino,
    });

    const guardada = await directivaRepo.save(nuevaDirectiva);
    return [guardada, null];
  } catch (error) {
    return [null, error.message];
  }
}
