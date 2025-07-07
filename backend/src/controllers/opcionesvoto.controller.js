import { AppDataSource } from "../config/configDb.js";
import OpcionesVotoService from "../services/opcionesvoto.service.js";

// Controlador para crear una opción de voto
export const createOpcionVoto = async (req, res) => {
  try {
    const nuevaOpcion = await OpcionesVotoService.createOpcionVoto(req.body);
    res.status(201).json(nuevaOpcion);
  } catch (err) {
    console.error("Error al crear la opción de voto:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para obtener opciones por votación
export const getOpcionesByVotacion = async (req, res) => {
  try {
    const { id_votacion } = req.params;
    const opciones = await OpcionesVotoService.getOpcionesVotoByVotacion(id_votacion);
    res.status(200).json(opciones);
  } catch (err) {
    console.error("Error al buscar opciones:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};