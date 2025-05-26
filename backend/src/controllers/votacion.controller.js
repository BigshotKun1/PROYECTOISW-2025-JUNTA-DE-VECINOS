import { AppDataSource } from "../config/configDb";
import { Votacion } from "../entities/Votacion.js";
import { directiva } from "../entities/directiva.js";
import { user } from "../entities/user.js";

export const crearVotacion = async (req, res) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin } = req.body;

    if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (req.user.rol !== "directiva" && req.user.rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo la directiva puede crear votaciones." });
    }

    const nuevaVotacion = new Votacion();
    nuevaVotacion.titulo = titulo;
    nuevaVotacion.descripcion = descripcion;
    nuevaVotacion.fechaInicio = new Date(fechaInicio);
    nuevaVotacion.fechaFin = new Date(fechaFin);


    const votacionRepository = AppDataSource.getRepository(Votacion);
    const votacionCreada = await votacionRepository.save(nuevaVotacion);

    res.status(201).json({
      message: "Votación creada exitosamente",
      votacion: votacionCreada,
    });
  } catch (error) {
    console.error("Error al crear la votación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
export const obtenerVotacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const votacionRepository = AppDataSource.getRepository(Votacion);
    const votacion = await votacionRepository.findOne({
      where: { id_votacion: id },
      relations: ["id_usuario", "id_directiva"],
    });

    if (!votacion) {
      return res.status(404).json({ message: "Votación no encontrada" });
    }

    res.status(200).json({
      message: "Votación obtenida exitosamente",
      votacion,
    });
  } catch (error) {
    console.error("Error al obtener la votación por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
export const eliminarVotacion = async (req, res) => {
  try {
    const { id } = req.params;

    const votacionRepository = AppDataSource.getRepository(Votacion);
    const votacion = await votacionRepository.findOne({ where: { id_votacion: id } });

    if (req.user.rol !== "directiva" && req.user.rol !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo la directiva o administrador puede eliminar votaciones." });
    }

    if (!votacion) {
      return res.status(404).json({ message: "Votación no encontrada" });
    }

    await votacionRepository.remove(votacion);

    res.status(200).json({
      message: "Votación eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar la votación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}