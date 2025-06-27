import { AppDataSource } from "../config/configDb.js";
import votoService from "../services/voto.service.js";

export const emitirVoto = async (req, res) => {
  try {
    const { id_usuario, id_opcion_voto } = req.body;
    const voto = await votoService.emitirVoto({ id_usuario, id_opcion_voto });
    res.status(201).json({ message: "Voto registrado", voto });
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