import { AppDataSource } from "../config/configDb.js";
import { Brackets } from "typeorm";

export async function createDirectivaService({ id_usuario, id_rol, fechaInicio, fechaTermino }) {
  try {
    const directivaPeriodoRepo = AppDataSource.getRepository("DirectivaPeriodo");
    const directivaMiembroRepo = AppDataSource.getRepository("DirectivaMiembro");
    const usuarioRepo = AppDataSource.getRepository("User");
    const rolRepo = AppDataSource.getRepository("Rol");

    // Validar fechas
    if (new Date(fechaInicio) >= new Date(fechaTermino)) {
      return [null, "La fecha de inicio debe ser anterior a la fecha de término"];
    }

    // Validar rol permitido
    const rolesPermitidos = ["presidente", "tesorero", "secretario"];
    const rol = await rolRepo.findOne({ where: { id_rol } });
    if (!rol) return [null, "Rol no encontrado"];
    if (!rolesPermitidos.includes(rol.nombreRol.toLowerCase())) {
      return [null, "Rol no permitido para una directiva"];
    }

    // Traer usuario con su rol
    const usuario = await usuarioRepo.findOne({
      where: { id_usuario },
      relations: ["rol"],
    });

    if (!usuario) return [null, "Usuario no encontrado"];

    if (usuario.rol.id_rol !== id_rol) {
      return [
        null,
        `El rol asignado en la directiva (${rol.nombreRol}), no coincide con el rol real del usuario (${usuario.rol.nombreRol}).`
      ];
    }

    // Validar solapamiento de fechas para el mismo rol en cualquier periodo
    const miembroSolapado = await directivaMiembroRepo
      .createQueryBuilder("miembro")
      .innerJoin("miembro.periodo", "periodo")
      .where("miembro.id_rol = :id_rol", { id_rol })
      .andWhere(new Brackets(qb => {
        qb.where(":fechaInicio BETWEEN periodo.fechaInicio AND periodo.fechaTermino", { fechaInicio })
          .orWhere(":fechaTermino BETWEEN periodo.fechaInicio AND periodo.fechaTermino", { fechaTermino })
          .orWhere("periodo.fechaInicio BETWEEN :fechaInicio AND :fechaTermino", { fechaInicio, fechaTermino });
      }))
      .getOne();

    if (miembroSolapado) {
      return [null, "Ya existe un miembro con ese rol en un periodo que se solapa con las fechas indicadas"];
    }

    // Verificar si ya existe un periodo con las mismas fechas exactas
    let periodo = await directivaPeriodoRepo.findOne({
      where: {
        fechaInicio,
        fechaTermino,
      },
    });

    // Si no existe, lo creamos
    if (!periodo) {
      periodo = directivaPeriodoRepo.create({ fechaInicio, fechaTermino });
      await directivaPeriodoRepo.save(periodo);
    }

    // Validar que no exista ya un miembro con el mismo rol en ese periodo (redundante pero seguro)
    const miembroExistente = await directivaMiembroRepo.findOne({
      where: {
        id_periodo: periodo.id_periodo,
        id_rol,
      },
    });

    if (miembroExistente) {
      return [null, "Ya existe un miembro con ese rol en el período"];
    }

    // Validar que el usuario no esté ya en el mismo periodo
    const usuarioExistente = await directivaMiembroRepo.findOne({
      where: {
        id_periodo: periodo.id_periodo,
        id_usuario,
      },
    });

    if (usuarioExistente) {
      return [null, "El usuario ya es parte de la directiva en ese período"];
    }

    // Crear nuevo miembro
    const nuevoMiembro = directivaMiembroRepo.create({
      id_periodo: periodo.id_periodo,
      id_usuario,
      id_rol,
    });

    const guardado = await directivaMiembroRepo.save(nuevoMiembro);
    return [guardado, null];
  } catch (error) {
    return [null, error.message];
  }
}
