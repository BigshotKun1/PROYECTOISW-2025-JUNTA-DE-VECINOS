import { createVotacionService, obtenerVotacionPorId, deleteVotacionService } from "../services/votacion.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { votacionCreacionValidation } from "../validations/votacion.validation.js";
import { notifyVecinosVotaciones } from "../services/email.service.js";

export async function crearVotacion(req, res) {  
  try {
    const { body, user } = req;
    const { error } = votacionCreacionValidation.validate(body);
        if (error) {
          return handleErrorClient(res, 400, "Error de validación", error.message);
        }

    const [nuevaVotacion, errorVotacion] = await createVotacionService({ ...body, id_usuario: user.id_usuario });
      if (errorVotacion) {
        return handleErrorClient(res, 400, "Error al crear la votacion", errorVotacion);
      }
  
      handleSuccess(res, 201, "Votacion creada con éxito", nuevaVotacion);
      await notifyVecinosVotaciones(nuevaVotacion); 
  
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
};

export const obtenerVotacionPorIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const votacion = await obtenerVotacionPorId(id);

    res.status(200).json({
      message: "Votación obtenida exitosamente",
      votacion,
    });
  } catch (error) {
    console.error("Error al obtener la votación por ID:", error);
    res.status(error.status || 500).json({ message: error.message || "Error interno del servidor" });
  }
};



export const eliminarVotacion = async (req, res) => {
  try {
    const { id_votacion } = req.params || {}; // Evita que falle si req.params es undefined

    if (!id_votacion) {
      return res.status(400).json({ status: "Client error", message: "ID de votación requerido" });
    }

    // Aquí llamarías a tu servicio para eliminar la votación
    const [resultado, error] = await deleteVotacionService(id_votacion);

    if (error) {
      return res.status(400).json({ status: "Client error", message: error });
    }

    res.status(200).json({ message: "Votación eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la votación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

