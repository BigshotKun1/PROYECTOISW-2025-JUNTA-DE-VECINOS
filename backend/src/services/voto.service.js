import { AppDataSource } from "../config/configDb.js";
import Voto from "../entity/Voto.js";

const votoRepo = AppDataSource.getRepository(Voto);

export const emitirVoto = async (data, userId) => {
  try {
    // Verifica si el usuario ya votó en esta votación
    const votoExistente = await votoRepo.findOne({
      where: { id_votacion: data.id_votacion, id_usuario: userId }
    });
    if (votoExistente) {
      throw new Error("Ya has votado en esta votación");
    }
    // Si no ha votado, crea el voto
    const nuevoVoto = votoRepo.create({
      id_votacion: data.id_votacion,
      opcion_index: data.opcion_index,
      id_usuario: userId,
    });
    return await votoRepo.save(nuevoVoto);
  } catch (error) {
    console.error("Error al emitir voto:", error);
    throw error;
  }
};

export const listarVotos = async () => {
  try {
    return await votoRepo.find();
  } catch (error) {
    console.error("Error al listar votos:", error);
    throw error;
  }
};

export const listarVotosPorVotacion = async (id_votacion) => {
  try {
    return await votoRepo.find({
      where: { id_votacion: Number(id_votacion) }
    });
  } catch (error) {
    console.error("Error al listar votos por votación:", error);
    throw error;
  }
};

export const usuarioYaVoto = async (id_votacion, id_usuario) => {
  try {
    const voto = await votoRepo.findOne({
      where: { id_votacion, id_usuario }
    });
    return !!voto;
  } catch (error) {
    console.error("Error al verificar si usuario ya votó:", error);
    throw error;
  }
};