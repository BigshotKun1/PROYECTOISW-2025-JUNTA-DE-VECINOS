import OpcionesVotoSchema from "../entity/OpcionesVotoE.js";
import { AppDataSource } from "../config/configDb.js";

const repo = AppDataSource.getRepository(OpcionesVotoSchema);

const createOpcionVoto = async (data) => {
  try {
    const opcion = repo.create(data);
    return await repo.save(opcion);
  } catch (err) {
    console.error("Error al crear la opción de voto:", err);
    throw err;
  }
};

const getOpcionesVotoByVotacion = async (id_votacion) => {
  try {
    return await repo.find({
      where: { id_votacion },
      order: { id_opcion_voto: "ASC" },
    });
  } catch (err) {
    console.error("Error al buscar opciones:", err);
    throw err;
  }
};

export default {
  createOpcionVoto,
  getOpcionesVotoByVotacion,
};