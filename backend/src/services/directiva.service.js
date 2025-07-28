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

    // Validar rol permitido para la directiva
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

    // Aquí validamos si el usuario tiene rol "vecino" o distinto al rol de directiva que queremos asignar
    if (usuario.rol.nombreRol.toLowerCase() === "vecino") {
      // Actualizamos el rol del usuario al rol nuevo
      usuario.rol = rol;  // asignamos el rol directo (relación)
      await usuarioRepo.save(usuario);
    } else if (usuario.rol.id_rol !== id_rol) {
      // Si el usuario ya tiene un rol diferente que no es vecino, devolvemos error
      return [
        null,
        `El usuario ya tiene un rol asignado (${usuario.rol.nombreRol}), que no coincide con el rol de la directiva (${rol.nombreRol}).`
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


export async function getDirectivaService() {
  try {
    const directivaMiembroRepo = AppDataSource.getRepository("DirectivaMiembro");
    const directivaPeriodoRepo = AppDataSource.getRepository("DirectivaPeriodo");
    const usuarioRepo = AppDataSource.getRepository("User");
    const rolRepo = AppDataSource.getRepository("Rol");

    const miembros = await directivaMiembroRepo.find({
      relations: ["usuario", "rol", "periodo"],
      order: { periodo: { fechaInicio: "DESC" } },
    });

    // Mapear para incluir nombre de rol
    const miembrosConRol = await Promise.all(
      miembros.map(async (miembro) => {
        const rol = await rolRepo.findOne({ where: { id_rol: miembro.id_rol } });
        return {
          ...miembro,
          rolNombre: rol ? rol.nombreRol : "Desconocido",
        };
      })
    );

    return [miembrosConRol, null];
  } catch (error) {
    return [null, error.message];
  }
}

export async function deleteDirectivaService({ id_usuario, id_periodo }) {
  try {
    const directivaMiembroRepo = AppDataSource.getRepository("DirectivaMiembro");

    // Buscar el miembro por usuario y periodo
    const miembro = await directivaMiembroRepo.findOne({
      where: { id_usuario, id_periodo },
      relations: ["usuario", "rol", "periodo"], // opcional: si quieres devolver más información
    });

    if (!miembro) {
      return [null, "Miembro de la directiva no encontrado"];
    }

    // Eliminar el miembro
    await directivaMiembroRepo.remove(miembro);

    return [miembro, null];
  } catch (error) {
    console.error("Error al eliminar miembro:", error);
    return [null, "Error interno del servidor"];
  }
}
