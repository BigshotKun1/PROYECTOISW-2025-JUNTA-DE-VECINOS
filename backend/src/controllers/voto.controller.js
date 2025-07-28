import * as votoService from "../services/voto.service.js";

export const emitirVoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    let { id_votacion, opcion_index } = req.body;
    id_votacion = Number(id_votacion);
    opcion_index = Number(opcion_index);

    if (isNaN(id_votacion) || isNaN(opcion_index)) {
      return res.status(400).json({ message: "Datos de voto inválidos" });
    }
    const voto = await votoService.emitirVoto({ id_votacion, opcion_index }, userId);
    res.status(201).json(voto);
  } catch (error) {
    if (error.message === "Ya has votado en esta votación") {
      return res.status(400).json({ message: error.message });
    }
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
    const votos = await votoService.listarVotosPorVotacion(id_votacion);
    res.status(200).json(votos);
  } catch (error) {
    console.error("Error en listarVotosPorVotacion:", error);
    res.status(500).json({ message: "Error al listar votos por votación" });
  }
};

export const verificarUsuarioYaVoto = async (req, res) => {
  try {
    const { id_votacion, id_usuario } = req.params;
    // Validación extra para evitar NaN
    if (!id_votacion || !id_usuario || isNaN(Number(id_votacion)) || isNaN(Number(id_usuario))) {
      return res.status(400).json({ message: "Parámetros inválidos" });
    }
    const yaVoto = await votoService.usuarioYaVoto(Number(id_votacion), Number(id_usuario));
    res.status(200).json({ yaVoto });
  } catch (error) {
    console.error("Error al verificar si usuario ya votó:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};