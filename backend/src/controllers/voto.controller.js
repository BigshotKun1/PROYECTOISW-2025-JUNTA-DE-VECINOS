import { AppDataSource } from "../config/configDb.js";
import votoService from "../services/voto.service.js";

export const emitirVoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    const voto = await votoService.emitirVoto(req.body, userId);
    res.status(201).json(voto);
  } catch (error) {
    console.error("Error al emitir voto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const listarVotos = async (req, res) => {
  try {
    const votos = await votoService.listarVotos();
    res.status(200).json({ message: "Lista de votos", votos });
  } catch (error) {
    console.error("Error al listar votos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const listarVotosPorVotacion = async (req, res) => {
  try {
    const { id_votacion } = req.params;
    if (!id_votacion) {
      return res.status(400).json({ message: "Falta el id_votacion" });
    }
    const votos = await AppDataSource.getRepository("Voto").find({
      where: { id_votacion: Number(id_votacion) }
    });
    res.status(200).json(votos);
  } catch (error) {
    console.error("Error en listarVotosPorVotacion:", error);
    res.status(500).json({ message: "Error al listar votos por votación" });
  }
};