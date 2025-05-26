import { AppDataSource } from "../config/configDb.js";
import Voto  from "../entity/voto.js";
import User  from "../entity/user.entity.js";

export const emitirVoto = async (req, res) => {
  try {
    const { id_votacion, id_usuario, opcion } = req.body;

    if (!id_votacion || !id_usuario || !opcion) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const votacionRepository = AppDataSource.getRepository(votacion);
    const votacion = await votacionRepository.findOne({ where: { id_votacion } });

    if (!votacion) {
      return res.status(404).json({ message: "Votación no encontrada" });
    }

    const yaVoto = await AppDataSource.getRepository(Voto).findOne({ where: { id_votacion, id_usuario } });
    if (yaVoto) {
      return res.status(400).json({ message: "El usuario ya ha votado en esta votación" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const usuario = await userRepository.findOne({ where: { id_usuario } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (ahora < horaInicio || ahora > horaFin) {
      return res.status(400).json({ message: "La votación no está activa en este momento" });
    }
    
    const nuevoVoto = new voto();
    nuevoVoto.id_votacion = votacion;
    nuevoVoto.id_usuario = usuario;
    nuevoVoto.opcion = opcion;

    const votoRepository = AppDataSource.getRepository(Voto);
    await votoRepository.save(nuevoVoto);

    res.status(201).json({
      message: "Voto emitido exitosamente",
      voto: nuevoVoto,
    });
  } catch (error) {
    console.error("Error al emitir el voto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
