import { AppDataSource } from "../config/configDb.js";
import Voto from "../entity/Voto.js";

const votoRepo = AppDataSource.getRepository(Voto);

const emitirVoto = async (data, userId) => {
  try {
    const nuevoVoto = votoRepo.create({
      ...data,
      id_usuario: userId,
    });
    return await votoRepo.save(nuevoVoto);
  } catch (error) {
    console.error("Error al emitir voto:", error);
    throw error;
  }
};

const listarVotos = async () => {
  try {
    return await votoRepo.find();
  } catch (error) {
    console.error("Error al listar votos:", error);
    throw error;
  }
};

export default {
  emitirVoto,
  listarVotos,
};