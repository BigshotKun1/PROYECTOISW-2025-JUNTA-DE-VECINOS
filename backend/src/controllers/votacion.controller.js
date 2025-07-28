import { createVotacionService, obtenerVotacionPorId, deleteVotacionService, obtenerTodasLasVotaciones } from "../services/votacion.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { votacionCreacionValidation } from "../validations/votacion.validation.js";
import { notifyVecinosVotaciones } from "../services/email.service.js";

export async function crearVotacion(req, res) {
  try {
    const { body } = req;
    const id_usuario = req.user.id_usuario; // <-- lo toma del usuario autenticado

    // Validación con Joi
    const { error } = votacionCreacionValidation.validate(body, { abortEarly: false });
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos inválidos",
        error.details.map(d => d.message)
      );
    }

    const [nuevaVotacion, errorVotacion] = await createVotacionService({
      ...body,
      id_usuario // <-- lo agrega aquí
    });

    if (errorVotacion) {
      return handleErrorClient(res, 400, "Error al crear votación", errorVotacion);
    }

    handleSuccess(res, 201, "Votación creada con éxito", nuevaVotacion);
    await notifyVecinosVotaciones(nuevaVotacion);

  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export const eliminarVotacion = async (req, res) => {
  try {
    const { id_votacion } = req.params || {}; // Evita que falle si req.params es undefined

    if (!id_votacion) {
      return res.status(400).json({ status: "Client error", message: "ID de votación requerido" });
    }

    // Aquí llamarías a tu servicio para eliminar la votación
    const [resultado, error] = await deleteVotacionService({ id_votacion });

    if (error) {
      return res.status(400).json({ status: "Client error", message: error });
    }

    res.status(200).json({ message: "Votación eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la votación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerVotacionesController = async (req, res) => {
  try {
    const votaciones = await obtenerTodasLasVotaciones();
    res.status(200).json({
      message: "Votaciones obtenidas exitosamente",
      votaciones,
    });
  } catch (error) {
    console.error("Error al obtener las votaciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};