"use strict";
import Asistencia from "../entity/Asistencia_Reunion.js";
import { AppDataSource } from "../config/configDb.js";
import User from "../entity/user.entity.js";
import Reunion from "../entity/Reunion.js";

export async function createAsistenciasService(id_reunion) {
  try {
    console.log(id_reunion);
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    const userRepository = AppDataSource.getRepository(User);
    //QueryBuilder + getMany() + Mapping
    const vecinos = await userRepository
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.rol", "rol")
      .where("rol.nombreRol IN (:...roles)", {
        roles: ["Vecino", "Presidente", "Tesorero", "Secretario"],
      })
      .select(["user.id_usuario"])
      .getMany();
    const newAsistencia = vecinos.map((vecino) => {
      return asistenciaRepository.create({
        id_usuario: { id_usuario: vecino.id_usuario },
        id_reunion: { id_reunion: id_reunion },
        id_estado_asistencia: { id_estado_asistencia: 1 },
      });
    });
    console.log("asistencia createService", newAsistencia);
    if (!newAsistencia) return "No se pudo generar la asistencia";

    await asistenciaRepository.save(newAsistencia);
    return [newAsistencia, null];
  } catch (error) {
    console.error("Error al crear lista de asistencia, el error es:", error);
  }
}

export async function getAsistenciasService(id) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);
    console.log(id);
    const meetingRepository = AppDataSource.getRepository(Reunion);

    const meetingFound = await meetingRepository.findOne({
      where: { id_reunion: id },
    });

    if (!meetingFound) return [null, "No se encontro la reunion."];

    const listaAsistencia = await asistenciaRepository.find({
      where: { id_reunion: id },
      relations: ["id_usuario", "id_estado_asistencia"],
    });

    console.log(listaAsistencia.length);

    if (!listaAsistencia || listaAsistencia.length == 0)
      return [null, "No hay asistentes para esta reunión"];

    return [listaAsistencia, null];
  } catch (error) {
    console.error("Error al obtener lista de asistencia, el error es:", error);
  }
}

export async function updateAsistenciaService(id, data) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    const asistenciaFound = await asistenciaRepository.findOne({
      where: {
        id_asistencia_reunion: id,
      },
    });
    //console.log(asistenciaFound)
    if (!asistenciaFound)
      return [null, "No se encontro el registro de asistencia."];

    asistenciaFound.id_estado_asistencia = data.id_estado_asistencia;
    console.log(asistenciaFound);
    const asistenciaActualizada =
      await asistenciaRepository.save(asistenciaFound);

    return [asistenciaActualizada, null];
  } catch (error) {
    console.error("Error al modificar  asistencia, el error es:", error);
  }
}

export async function deleteAsistenciaService(id) {
  try {
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    const asistenciaFound = await asistenciaRepository.findOne({
      where: { id_asistencia_reunion: id },
    });

    await asistenciaRepository.remove(asistenciaFound);
  } catch (error) {
    console.error("Error al eliminar  asistencia, el error es:", error);
  }
}

export async function getEstadisticasAsistenciaService() {
  try {
    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    const resultados = await asistenciaRepository
      .createQueryBuilder("a")
      .innerJoin("a.id_reunion", "reunion")
      .innerJoin("a.id_estado_asistencia", "estado")
      .select("reunion.descripcion_reunion", "reunion")
      .addSelect(
        "SUM(CASE WHEN estado.nombre_estado_asistencia = 'Presente' THEN 1 ELSE 0 END)",
        "presentes",
      )
      .addSelect(
        "SUM(CASE WHEN estado.nombre_estado_asistencia = 'Ausente' THEN 1 ELSE 0 END)",
        "ausentes",
      )
      .addSelect("reunion.fecha_reunion")
      .groupBy("reunion.descripcion_reunion")
      .addGroupBy("reunion.fecha_reunion")
      .getRawMany();

    console.log("Resultados service:", resultados);
    return [resultados, null];
  } catch (error) {
    console.error("Error al obtener estadísticas de asistencia:", error);
    return [null, "Error al obtener estadísticas"];
  }
}

export async function getHistorialDeAsistenciaService(rut) {
  try {
    const usuarioRepository = AppDataSource.getRepository(User);

    const usuario = await usuarioRepository.findOne({
      where: { rut },
    });

    if (!usuario) return [null, "No se encontró usuario con ese RUT"];

    const asistenciaRepository = AppDataSource.getRepository(Asistencia);

    const resultados = await asistenciaRepository
      .createQueryBuilder("asistencia")
      .innerJoin("asistencia.id_reunion", "reunion")
      .innerJoin("asistencia.id_estado_asistencia", "estado")
      .where("asistencia.id_usuario = :id", { id: usuario.id_usuario })
      .select([
        "asistencia.id_asistencia_reunion AS id_asistencia",
        "estado.nombre_estado_asistencia AS estado",
        "reunion.fecha_reunion AS fecha",
        "reunion.descripcion_reunion AS descripcion",
      ])
      .getRawMany();

    if (!resultados || resultados.length === 0)
      return [null, "No se encontró historial de asistencia"];

    return [resultados, null];
  } catch (error) {
    console.error("Error al obtener historial de asistencia:", error);
    return [null, "Error al obtener historial de asistencia"];
  }
}
